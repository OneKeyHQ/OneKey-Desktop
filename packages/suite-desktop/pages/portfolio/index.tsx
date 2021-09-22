import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sendFormEthereumActions from '@wallet-actions/send/sendFormEthereumActions';
import { Button } from '@trezor/components';
import { Image, Translation } from '@suite-components';
import { ActionSelect as Select } from '@suite-components/Settings';
import { AppState, Dispatch } from '@suite-types';

import Exception from '@wallet-components/AccountException';
import AccountMode from '@wallet-components/AccountMode';
import AccountAnnouncement from '@wallet-components/AccountAnnouncement';
import { MAX_WIDTH_WALLET_CONTENT } from '@suite-constants/layout';

import type Electron from 'electron';
import Portfolio from '@portfolio-views';
import { openDeferredModal, Transaction } from '@suite-actions/modalActions';

const ActionSelect = styled(Select)`
    width: 260px;
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
`;

const Footer = styled.div`
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: ${props => props.theme.BG_WHITE};
    border-top: 1px solid ${props => props.theme.STROKE_GREY};
    padding: 0 24px;
`;

enum CHAIN_SYMBOL_ID {
    eth = 1,
    kovan = 42,
    bsc = 56,
}

const CHAIN_SYMBOL_RPC = {
    [CHAIN_SYMBOL_ID.eth]: 'https://rpc.blkdb.cn/eth',
    [CHAIN_SYMBOL_ID.kovan]: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    [CHAIN_SYMBOL_ID.bsc]: 'https://rpc.blkdb.cn/bsc',
};

const CHAIN_OPTIONS = [
    {
        label: '以太坊 Ethereum 主网络',
        value: CHAIN_SYMBOL_ID.eth,
    },
    {
        label: '币安智能链 BSC 主网',
        value: CHAIN_SYMBOL_ID.bsc,
    },
    {
        label: 'Kovan 测试网络',
        value: CHAIN_SYMBOL_ID.kovan,
    },
];

function getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const mapStateToProps = (state: AppState) => ({
    defaultAccount: state.wallet.selectedAccount,
    selectedAccount: state.explore.selectedAccount,
    language: state.suite.settings.language,
    theme: state.suite.settings.theme.variant,
    accounts: state.wallet.accounts,
    device: state.suite.device,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            signWithPush: sendFormEthereumActions.signAndPublishTransactionInSwap,
            openDeferredModal,
        },
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Container: FC<Props> = ({
    defaultAccount,
    selectedAccount,
    signWithPush,
    language,
    theme,
    openDeferredModal
}) => {
    const [ref, setRef] = useState<HTMLElement>();
    const [isLoading, setIsLoading] = useState(true);
    const [webviewRef, setWebviewRef] = useState<Electron.WebviewTag>();
    const [loadFailed, setLoadFailed] = useState(false);
    const [activeChainId, setActiveChainId] = useState<CHAIN_SYMBOL_ID>(CHAIN_SYMBOL_ID.eth);

    const chainRPCUrl = CHAIN_SYMBOL_RPC[activeChainId];

    const currentAccount = selectedAccount?.current || defaultAccount?.account;
    const freshAddress = { address: currentAccount?.descriptor || '' };


    useEffect(() => {
        if (!ref) return;
        // @ts-expect-error
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        const observer = new MutationObserver((mutations: any) => {
            mutations.forEach((mutation: any) => {
                if (
                    Array.prototype.some.call(
                        mutation.addedNodes,
                        (node: Electron.WebviewTag) => node.id === 'onekey-portfolio',
                    )
                ) {
                    setWebviewRef(
                        document.getElementById('onekey-portfolio') as Electron.WebviewTag,
                    );
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
        setIsLoading(true);
        webviewRef?.reloadIgnoringCache?.();
    }, [webviewRef]);

    const { urlHash, settingsStr } = useMemo(() => {
        const object = {
            address: `${freshAddress.address}`,
            rpcUrl: chainRPCUrl,
            chainId: activeChainId,
            debug: true,
        };
        const settingsStr = `theme=${theme}&language=${language}`;

        return {
            urlHash: JSON.stringify(object),
            settingsStr,
        };
    }, [freshAddress, activeChainId, language, theme, chainRPCUrl]);

    useEffect(() => {
        if (isLoading) return;
        const prevUrl = webviewRef?.getURL() ?? '';

        const preTheme = getParameterByName('theme', prevUrl);
        const preLang = getParameterByName('language', prevUrl);
        const prevSettings = `theme=${preTheme}&language=${preLang}`;
        const prevConfig = getParameterByName('config', prevUrl);
        const currentUrl = `https://portfolio.onekey.so/?config=${urlHash}&${settingsStr}`;
        if (
            !/^https:\/\/portfolio.onekey.so/.test(prevUrl) ||
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
        const currentUrl = `https://portfolio.onekey.so/?config=${urlHash}&${settingsStr}`;

        ref.innerHTML = `
            <webview
                allowpopups
                sandbox
                id="onekey-portfolio"
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
            setIsLoading(false);
        }

        function domReadyEvent() {
            setIsLoading(false);
        }

        async function registerEvent(event: Electron.IpcMessageEvent) {
            if (!webviewRef) return;
            const payload = event.args[0];
            if (event.channel === 'sign/transaction') {
                const { id, transaction } = payload;
                try {
                    const params = {
                        ...transaction,
                        chainId: activeChainId,
                        rpcUrl: chainRPCUrl,
                        accountPath: currentAccount?.path
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
            } else if (event.channel === 'request/account') {
                const { id } = payload;
                webviewRef.send('response/account', {
                    id,
                    address: freshAddress.address,
                });
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
    }, [
        webviewRef,
        chainRPCUrl,
        activeChainId,
        signWithPush,
        freshAddress.address,
        openDeferredModal,
    ]);

    if (defaultAccount.status === 'loading') {
        return (
            <ToastInfo>
                <Image width={160} height={160} image="spinner" />
            </ToastInfo>
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

            <div style={{ width: '100%', height: '100%' }} ref={handleRef} />
        </OuterContainer>
    );
};

const PortfolioContainer: FC<Props> = props => {
    const { accounts, device } = props;
    const list = accounts.filter(a => device && device.state === a.deviceState);
    const normalAccounts = list.filter(
        a => a.accountType === 'normal' && a.symbol === 'eth' && (!a.empty || a.visible),
    );
    return <Portfolio key="portfolio" menu={<Container {...props} />} loaded={props.defaultAccount.status === 'loaded' && normalAccounts.length > 1 } />;
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioContainer);
