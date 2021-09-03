import React, { FC, useCallback, useEffect, useState } from 'react';
import { IpcMessageEvent, WebviewTag } from 'electron';
import { Transaction } from '@suite-actions/modalActions';
import { Image, Translation } from '@suite-components';
import AccountMode from '@wallet-components/AccountMode';
import AccountAnnouncement from '@wallet-components/AccountAnnouncement';
import Exception from '@wallet-components/AccountException';
import { Button, Icon, useTheme } from '@trezor/components';
import { Props } from './index';
import styled from 'styled-components';
import { ActionSelect as Select } from '@suite-components/Settings';
import { MAX_WIDTH_WALLET_CONTENT } from '@suite-constants/layout';

const ActionSelect = styled(Select)`
    width: 260px;
`;

const WrapperOuter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: ${MAX_WIDTH_WALLET_CONTENT};
    width: 100%;
    height: 100%;
`;

const OuterContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const ToastInfo = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 200px;
    height: 200px;
    align-items: center;
    border-radius: 24px;
    background: ${props => props.theme.BG_WHITE};
    box-shadow: 0 10px 80px 0 ${props => props.theme.BOX_SHADOW_MODAL};
`;

const ToolBar = styled.div`
    height: 4vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: ${props => props.theme.BG_WHITE};
    padding: 0.5vw 1vw;
`;

const AdressBarContainer = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    flex: 1;
    background: ${props => props.theme.BG_GREY};
    border-radius: 0.5vw;
    padding: 0 0.7vw;
    margin-right: 1vw;
`;

const AdressBar = styled.input`
    flex: 1;
    background: ${props => props.theme.BG_GREY};
`;

const WebviewContainer = styled.div`
    > * {
        margin: 0 auto;
    }
`;

enum CHAIN_SYMBOL_ID {
    KOVAN = 42,
    ETH = 1,
    BSC = 56,
    OKEX = 66,
    POLYGON = 137,
    HECO = 128,
    XDAI = 100,
    AVALANCHE = 43114,
    FANTOM = 250
}

const CHAIN_SYMBOL_RPC = {
    [CHAIN_SYMBOL_ID.ETH]: 'https://rpc.blkdb.cn/eth',
    [CHAIN_SYMBOL_ID.BSC]: 'https://rpc.blkdb.cn/bsc',
    [CHAIN_SYMBOL_ID.HECO]: 'https://rpc.blkdb.cn/heco',
    [CHAIN_SYMBOL_ID.OKEX]: 'https://exchainrpc.okex.org',
    [CHAIN_SYMBOL_ID.POLYGON]: 'https://rpc-mainnet.matic.network',
    [CHAIN_SYMBOL_ID.XDAI]: 'https://rpc.xdaichain.com',
    [CHAIN_SYMBOL_ID.FANTOM]: 'https://rpcapi.fantom.network',
    [CHAIN_SYMBOL_ID.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
    [CHAIN_SYMBOL_ID.KOVAN]: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
};

const symbolToChainId = {
    ETH: CHAIN_SYMBOL_ID.ETH,
    BSC: CHAIN_SYMBOL_ID.BSC,
    HECO: CHAIN_SYMBOL_ID.HECO,
    OKT: CHAIN_SYMBOL_ID.OKEX,
    POLYGON: CHAIN_SYMBOL_ID.POLYGON,
    XDAI: CHAIN_SYMBOL_ID.XDAI,
    FTM: CHAIN_SYMBOL_ID.FANTOM,
    AVALANCHE: CHAIN_SYMBOL_ID.AVALANCHE
};

const CHAIN_OPTIONS = [
    {
        label: <Translation id="NETWORK_ETHEREUM"></Translation>,
        value: CHAIN_SYMBOL_ID.ETH,
    },
    {
        label: <Translation id="NETWORK_BSC"></Translation>,
        value: CHAIN_SYMBOL_ID.BSC,
    },
    {
        label: <Translation id="NETWORK_HECO"></Translation>,
        value: CHAIN_SYMBOL_ID.HECO,
    },
    {
        label: <Translation id="NETWORK_OEC"></Translation>,
        value: CHAIN_SYMBOL_ID.OKEX,
    },
    {
        label: <Translation id="NETWORK_POLYGON"></Translation>,
        value: CHAIN_SYMBOL_ID.POLYGON,
    },
    {
        label: <Translation id="NETWORK_XDAI"></Translation>,
        value: CHAIN_SYMBOL_ID.XDAI,
    },
    {
        label: <Translation id="NETWORK_FANTOM"></Translation>,
        value: CHAIN_SYMBOL_ID.FANTOM,
    },
    {
        label: <Translation id="NETWORK_AVALANCHE"></Translation>,
        value: CHAIN_SYMBOL_ID.AVALANCHE,
    },
    {
        label: <Translation id="NETWORK_KOVAN"></Translation>,
        value: CHAIN_SYMBOL_ID.KOVAN,
    }
];

const DISCOVERY_HOME_URL = `https://discover.onekey.so/`;

function updateUrlParameter(uri: string, key: string, value: string) {
    const i = uri.indexOf('#');
    const hash = i === -1 ? '' : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);

    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
        uri = uri.replace(re, `$1${key}=${value}$2`);
    } else {
        uri = `${uri + separator + key}=${value}`;
    }
    return uri + hash;
}

interface TabProps {
    dapp?: any;
    setDapp: (dapp: any) => void;
    openTab: (dapp: any) => void;
}

const Container: FC<Props & TabProps> = ({
    selectedAccount,
    defaultAccount,
    signWithPush,
    openDeferredModal,
    addFavorite,
    getFavorite,
    removeFavorite,
    dapp,
    setDapp,
    openTab,
}) => {
    const theme = useTheme();
    const [isLoading, setLoadingStatus] = useState(false);
    const [webviewRef, setWebviewRef] = useState<WebviewTag>();
    const [loadFailed, setLoadFailed] = useState(false);
    const [lastAddress, setLastAddress] = useState('');
    const [isConnected, setConnected] = useState(false);
    const [activeChainId, setActiveChainId] = useState<CHAIN_SYMBOL_ID | null>(
        dapp?.chain ? symbolToChainId[dapp.chain as 'ETH'] : null,
    );

    const chainRPCUrl = activeChainId ? CHAIN_SYMBOL_RPC[activeChainId] : null;
    const [input, setInput] = useState(dapp?.url ?? 'home');

    const { current } = selectedAccount;
    const { account } = defaultAccount;

    const freshAddress = { address: current || account?.descriptor || '' };

    const setIsLoading = useCallback(
        val => {
            setLoadingStatus(val);
            if (val) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 5000);
            }
        },
        [setLoadingStatus],
    );

    const handleRef = useCallback(
        node => {
            setWebviewRef(node);
        },
        [setWebviewRef],
    );

    const handleReload = useCallback(() => {
        if (!webviewRef || isLoading) return;
        setLoadFailed(false);
        setIsLoading(true);
        setConnected(false);
        webviewRef?.reloadIgnoringCache?.();
    }, [webviewRef, isLoading, setIsLoading]);

    useEffect(() => {
        setLastAddress(freshAddress.address);
    }, [freshAddress.address]);

    useEffect(() => {
        if (isConnected && lastAddress && freshAddress.address !== lastAddress) {
            handleReload();
        }
    }, [freshAddress.address, lastAddress]);

    useEffect(() => {
        try {
            webviewRef?.send('response/config', {
                id: -1,
                payload: {
                    address: `${freshAddress.address}`,
                    rpcUrl: chainRPCUrl,
                    chainId: activeChainId,
                    debug: true,
                },
            });
        } catch {
            // ignore
        }
    }, [activeChainId, chainRPCUrl, freshAddress.address, webviewRef]);

    useEffect(() => {
        if (!webviewRef) return;

        function didFailLoading() {
            // setLoadFailed(true);
            setIsLoading(false);
        }

        async function registerEvent(event: IpcMessageEvent) {
            if (!webviewRef) return;
            const arg = event.args[0];
            if (event.channel === 'sign/transaction') {
                const { id, transaction } = arg;
                try {
                    const params = {
                        ...transaction,
                        chainId: activeChainId,
                        rpcUrl: chainRPCUrl,
                    };
                    const alteredParams = (await openDeferredModal({
                        transaction: params,
                        type: 'change-gas',
                    } as any)) as Transaction;

                    const txid = await signWithPush(alteredParams, { type: 'final' } as any);
                    webviewRef.send('sign/broadcast', {
                        id,
                        txid,
                    });
                } catch (e) {
                    webviewRef.send('sign/broadcast', {
                        id,
                        error: e,
                    });
                }
            } else if (event.channel === 'open/dapp') {
                const { payload } = arg;
                openTab(payload);
            } else if (event.channel === 'open/link') {
                const { id, payload } = arg;
                const link = payload.trim();
                openTab({
                    code: id,
                    url: link.startsWith('http') ? link : `https://${link}`,
                    name: link,
                });
            } else if (event.channel === 'get/config') {
                const { id } = arg;

                const chainRPCUrl = CHAIN_SYMBOL_RPC[activeChainId!];

                try {
                    // eslint-disable-next-line no-underscore-dangle,no-restricted-syntax
                    for (const _i of new Array(3)) {
                        // eslint-disable-next-line no-await-in-loop
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        // eslint-disable-next-line no-await-in-loop
                        await webviewRef.send('response/config', {
                            id,
                            payload: {
                                address: `${freshAddress.address}`,
                                rpcUrl: chainRPCUrl,
                                chainId: activeChainId,
                                debug: true,
                            },
                        });
                    }
                } catch (e) {
                    // ingore
                }
            } else if (event.channel === 'request/account') {
                const { id } = arg;
                setConnected(true);
                webviewRef.send('response/account', {
                    id,
                    address: freshAddress.address,
                });
            } else if (event.channel === 'common') {
                const { id, type, payload } = arg;
                if (type === 'favorite/get') {
                    webviewRef.send('common', {
                        id,
                        payload: getFavorite(),
                    });
                }
                if (type === 'favorite/remove') {
                    webviewRef.send('common', {
                        id,
                        success: removeFavorite(payload),
                    });
                }
            }
        }

        function domReadyEvent() {
            setIsLoading(false);
        }

        function handleNavigateInPage({ url }: { url: string }) {
            setInput(url);
        }

        function handleNewPage(e: Event & { url: string }) {
            e.preventDefault();
            const { url } = e;
            openTab({
                code: url,
                url,
                name: url,
            });
        }

        function handleTitleChange({ title }: { title: string }) {
            setDapp((p: any) => ({
                ...p,
                title,
            }));
        }

        function handleFaviconChange({ favicons }: { favicons: string[] }) {
            console.log(favicons);
            setDapp((p: any) => ({
                ...p,
                favicon: favicons[0],
            }));
        }

        webviewRef.addEventListener('did-fail-load', didFailLoading);
        webviewRef.addEventListener('ipc-message', registerEvent);
        webviewRef.addEventListener('did-navigate-in-page', handleNavigateInPage);
        webviewRef.addEventListener('new-window', handleNewPage);
        webviewRef.addEventListener('page-title-updated', handleTitleChange);
        webviewRef.addEventListener('page-favicon-updated', handleFaviconChange);
        webviewRef.addEventListener('dom-ready', domReadyEvent);
        return () => {
            webviewRef.removeEventListener('did-fail-load', didFailLoading);
            webviewRef.removeEventListener('ipc-message', registerEvent);
            webviewRef.removeEventListener('did-navigate-in-page', handleNavigateInPage);
            webviewRef.removeEventListener('new-window', handleNewPage);
            webviewRef.removeEventListener('page-title-updated', handleTitleChange);
            webviewRef.removeEventListener('page-favicon-updated', handleFaviconChange);
            webviewRef.removeEventListener('dom-ready', domReadyEvent);
        };
    }, [webviewRef, chainRPCUrl, activeChainId, signWithPush, freshAddress.address, setIsLoading]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
                const url = input.startsWith('http') ? input : `https://${input}`;
                setLoadFailed(false);
                setIsLoading(true);
                setDapp((p: any) => ({
                    ...p,
                    url,
                }));
                setActiveChainId(null);
            }
        },
        [input, setDapp, setIsLoading],
    );

    const canGoBack = useCallback(() => {
        try {
            return webviewRef?.canGoBack();
        } catch {
            return false;
        }
    }, [webviewRef, isLoading]);

    const canGoForward = useCallback(() => {
        try {
            return webviewRef?.canGoForward();
        } catch {
            return false;
        }
    }, [webviewRef, isLoading]);

    if (defaultAccount.status === 'loading') {
        return (
            <ToastInfo>
                <Image width={160} height={160} image="spinner" />
            </ToastInfo>
        );
    }

    if (defaultAccount.status === 'exception') {
        return (
            <WrapperOuter key="explore-exception">
                <Wrapper>
                    <AccountMode mode={defaultAccount.mode} />
                    <AccountAnnouncement selectedAccount={defaultAccount} />
                    <Exception account={defaultAccount} />
                </Wrapper>
            </WrapperOuter>
        );
    }

    const webview = React.createElement('webview', {
        allowpopups: 'true',
        sandbox: 'true',
        enableremotemodule: 'true',
        src: dapp?.url ?? DISCOVERY_HOME_URL,
        useragent:
            'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
        preload: `file://${window.INJECT_PATH}?timestamp=${new Date().getTime()}`,
        style: { width: '100%', height: '100%' },
        ref: handleRef,
    });

    return (
        <OuterContainer>
            {!!dapp?.url && (
                <ToolBar>
                    <Icon
                        size={24}
                        onClick={() => webviewRef?.goBack()}
                        icon="ARROW_LEFT"
                        color={!canGoBack() ? theme.TYPE_LIGHTER_GREY : theme.TYPE_DARK_GREY}
                    />
                    <Icon
                        size={24}
                        onClick={() => webviewRef?.goForward()}
                        icon="ARROW_RIGHT"
                        color={!canGoForward() ? theme.TYPE_LIGHTER_GREY : theme.TYPE_DARK_GREY}
                    />
                    <Image
                        style={{ cursor: 'pointer', marginRight: 24 }}
                        onClick={handleReload}
                        width={24}
                        height={24}
                        image="reload"
                    />
                    <AdressBarContainer>
                        <AdressBar
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Icon
                            size={24}
                            onClick={() =>
                                getFavorite().includes(dapp.code)
                                    ? removeFavorite(dapp.code)
                                    : addFavorite(dapp.code)
                            }
                            icon={getFavorite().includes(dapp.code) ? 'FAVORITE' : 'UNFAVORITE'}
                            color="#515151"
                        />
                    </AdressBarContainer>
                    <ActionSelect
                        hideTextCursor
                        useKeyPressScroll
                        noTopLabel
                        placeholder="请手动选择适合 DApp 的网络"
                        isDisabled={!!dapp?.chain}
                        value={
                            activeChainId
                                ? {
                                      value: activeChainId,
                                      label:
                                          CHAIN_OPTIONS.find(item => item.value === activeChainId)
                                              ?.label ?? '',
                                  }
                                : null
                        }
                        options={CHAIN_OPTIONS}
                        onChange={(option: typeof CHAIN_OPTIONS[0]) => {
                            setActiveChainId(option.value);
                        }}
                        data-test="@explore/select"
                    />
                </ToolBar>
            )}
            {loadFailed && (
                <ToastInfo>
                    <Translation id="TR_LOAD_FAILED" />
                    <Button onClick={handleReload} style={{ marginTop: 12 }}>
                        <Translation id="TR_TRY_AGAIN" />
                    </Button>
                </ToastInfo>
            )}
            {dapp?.url && isLoading && (
                <ToastInfo>
                    <Image width={160} height={160} image="spinner" />
                </ToastInfo>
            )}
            <WebviewContainer
                style={{ width: '100%', height: dapp?.url ? 'calc(100% - 4vw)' : '100%' }}
            >
                {webview}
            </WebviewContainer>
        </OuterContainer>
    );
};

export default Container;
