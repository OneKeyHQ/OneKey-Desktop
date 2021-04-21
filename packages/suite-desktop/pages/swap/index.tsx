import React, { FC, useEffect, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sendFormEthereumActions from '@wallet-actions/send/sendFormEthereumActions';
import { useDiscovery } from '@suite-hooks';
import { Button } from '@trezor/components';
import { Translation, Image } from '@suite-components';
import { AppState, Dispatch, ExtendedMessageDescriptor } from '@suite-types';

import Exception from '@wallet-components/AccountException';
import AccountMode from '@wallet-components/AccountMode';
import AccountAnnouncement from '@wallet-components/AccountAnnouncement';
import AccountTopPanel from '@wallet-components/AccountTopPanel';
import { MAX_WIDTH_WALLET_CONTENT } from '@suite-constants/layout';

import { useTranslation } from '@suite-hooks/useTranslation';
import { SkeletonRectangle } from '@suite-components/Skeleton';

import DiscoveryLoader from '@suite/components/suite/DiscoveryLoader';

import type Electron from 'electron';
import Swap from '@swap-views';

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
`;

const Expanded = styled.div`
    background-color: ${props => props.theme.BG_WHITE};
    position: absolute;
    width: 36px;
    height: 36px;
    bottom: 60px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: ${props => `2px 2px 3px 0 ${props.theme.BOX_SHADOW_BLACK_5}`};
`;

enum CHAIN_SYMBOL_ID {
    kovan = 42,
    bsc = 56,
}

enum CHAIN_SYMBOL_RPC {
    kovan = 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    eth = 'https://rpc.blkdb.cn/eth',
    bsc = 'https://rpc.blkdb.cn/bsc',
}

const DEBUG_CHAIN_ID = 'bsc';

function getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const mapStateToProps = (state: AppState) => ({
    selectedAccount: state.wallet.selectedAccount,
    language: state.suite.settings.language,
    theme: state.suite.settings.theme.variant,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            signWithPush: sendFormEthereumActions.signAndPublishTransactionInSwap,
        },
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Container: FC<Props> = ({ selectedAccount, signWithPush, language, theme }) => {
    const { discovery, getDiscoveryStatus } = useDiscovery();
    const discoveryStatus = getDiscoveryStatus();

    const [ref, setRef] = useState<HTMLElement>();
    const [isLoading, setIsLoading] = useState(true);
    const [webviewRef, setWebviewRef] = useState<Electron.WebviewTag>();
    const [loadFailed, setLoadFailed] = useState(false);
    const { account, network } = selectedAccount;

    const unused = account?.addresses
        ? account?.addresses.unused
        : [
              {
                  path: account?.path,
                  address: account?.descriptor,
                  transfers: account?.history.total,
              },
          ];
    const freshAddress = unused[0];

    useEffect(() => {
        if (!ref) return;
        // @ts-expect-error
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        const observer = new MutationObserver((mutations: any) => {
            mutations.forEach((mutation: any) => {
                if (
                    Array.prototype.some.call(
                        mutation.addedNodes,
                        (node: Electron.WebviewTag) => node.id === 'onekey-swap',
                    )
                ) {
                    setWebviewRef(document.getElementById('onekey-swap') as Electron.WebviewTag);
                }
            });
        });
        observer.observe(ref, { childList: true });
    }, [ref]);

    const handleRef = useCallback(
        node => {
            setRef(node);
        },
        [setRef],
    );

    const handleReload = useCallback(() => {
        if (!webviewRef) return;
        setLoadFailed(false);
        webviewRef?.reloadIgnoringCache?.();
    }, [webviewRef]);

    const { urlHash, settingsStr } = useMemo(() => {
        const object = {
            address: `${freshAddress.address}`,
            rpcUrl: CHAIN_SYMBOL_RPC[DEBUG_CHAIN_ID] || CHAIN_SYMBOL_RPC.eth,
            chainId: CHAIN_SYMBOL_ID[DEBUG_CHAIN_ID] || network?.chainId,
            debug: true,
        };
        const settingsStr = JSON.stringify({
            theme,
            language,
        });

        return {
            urlHash: JSON.stringify(object),
            settingsStr,
        };
    }, [freshAddress, network?.chainId, language, theme]);

    useEffect(() => {
        if (isLoading) return;
        const prevUrl = webviewRef?.getURL() ?? '';

        const prevSettings = getParameterByName('settings', prevUrl);
        const prevConfig = getParameterByName('config', prevUrl);
        const currentUrl = `https://swap.onekey.so/?config=${urlHash}&settings=${settingsStr}`;
        if (
            !/^https:\/\/swap.onekey.so/.test(prevUrl) ||
            prevSettings !== settingsStr ||
            prevConfig !== urlHash
        ) {
            setIsLoading(true);
            webviewRef?.loadURL(currentUrl);
        }
    }, [urlHash, isLoading, webviewRef, settingsStr]);

    useEffect(() => {
        if (!ref) return;
        // React 会删除 allowpopups 属性
        const currentUrl = `https://swap.onekey.so/?config=${urlHash}&settings=${settingsStr}`;

        ref.innerHTML = `
            <webview
                allowpopups
                id="onekey-swap"
                src=${currentUrl}
                preload="file://${window.INJECT_PATH}"
                style="width: 100%; height: 100%;"
            />
        `;
    }, [ref, settingsStr, urlHash]);

    useEffect(() => {
        if (!webviewRef) return;
        function didFailLoading() {
            setLoadFailed(true);
        }

        function domReadyEvent() {
            setIsLoading(false);
        }

        async function registerEvent(event: Electron.IpcMessageEvent) {
            if (!webviewRef) return;
            if (event.channel === 'sign/transaction') {
                const payload = event.args[0];
                const { id, transaction } = payload;
                const params = {
                    ...transaction,
                    chainId: CHAIN_SYMBOL_ID[DEBUG_CHAIN_ID] || network?.chainId,
                    rpcUrl: CHAIN_SYMBOL_RPC[DEBUG_CHAIN_ID] || CHAIN_SYMBOL_RPC.eth,
                };
                try {
                    const txid = await signWithPush(params, ({ type: 'final' } as unknown) as any);
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
            }
        }

        webviewRef.addEventListener('dom-ready', domReadyEvent);
        webviewRef.addEventListener('did-fail-load', didFailLoading);
        webviewRef.addEventListener('ipc-message', registerEvent);
        return () => {
            webviewRef.removeEventListener('dom-ready', domReadyEvent);
            webviewRef.removeEventListener('did-fail-load', didFailLoading);
            webviewRef.removeEventListener('ipc-message', registerEvent);
        };
    }, [webviewRef, network?.chainId, signWithPush]);

    if (selectedAccount.status === 'loading') {
        return (
            <ToastInfo>
                <Image width={80} height={80} image="SPINNER" />
            </ToastInfo>
        );
    }

    if (selectedAccount.status === 'exception') {
        return (
            <Wrapper key="swap-exception">
                <AccountMode mode={selectedAccount.mode} />
                <AccountAnnouncement selectedAccount={selectedAccount} />
                <Exception account={selectedAccount} />
            </Wrapper>
        );
    }
    return (
        <OuterContainer>
            {loadFailed && (
                <ToastInfo>
                    <Translation id="TR_LOAD_FAILED" />
                    <Button onClick={handleReload} style={{ marginTop: 12 }}>
                        <Translation id="TR_TRY_AGAIN" />
                    </Button>
                </ToastInfo>
            )}
            <Expanded onClick={handleReload}>
                <Image width={18} height={18} image="RELOAD" />
            </Expanded>
            <div style={{ width: '100%', height: '100%' }} ref={handleRef} />
        </OuterContainer>
    );
};

const SwapContainer: FC<Props> = props => {
    return <Swap key="swap" menu={<Container {...props} />} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(SwapContainer);
