import React, { FC, useEffect, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sendFormEthereumActions from '@wallet-actions/send/sendFormEthereumActions';

import { Button } from '@trezor/components';
import { Translation, Loading, Image, Modal, ModalProps } from '@suite-components';
import { AppState, Dispatch } from '@suite-types';
import type Electron from 'electron';

import Swap from '@swap-views';

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
    kovan = 'https://kovan.infura.io/v3/',
    eth = 'https://rpc.blkdb.cn/eth',
    bsc = 'https://rpc.blkdb.cn/bsc',
}

const DEBUG_CHAIN_ID = 'kovan';

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
    const [ref, setRef] = useState<Electron.WebviewTag | undefined>();
    const [isLoading, setIsLoading] = useState(true);
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

    const handleRef = useCallback(
        (node: Electron.WebviewTag) => {
            setRef(node);
        },
        [setRef],
    );

    const handleReload = useCallback(() => {
        if (!ref) return;
        setLoadFailed(false);
        ref?.reloadIgnoringCache?.();
    }, [ref]);

    const urlHash = useMemo(() => {
        const object = {
            address: `${freshAddress.address}`,
            rpcUrl: CHAIN_SYMBOL_RPC[DEBUG_CHAIN_ID] || CHAIN_SYMBOL_RPC.eth,
            chainId: CHAIN_SYMBOL_ID[DEBUG_CHAIN_ID] || network?.chainId,
            debug: true,
        };
        return JSON.stringify(object);
    }, [freshAddress, network?.chainId]);

    useEffect(() => {
        if (isLoading) return;
        const prevUrl = ref?.getURL() ?? '';

        const settingsStr = JSON.stringify({
            theme,
            language,
        });

        const currentUrl = `https://swap.onekey.so/?config=${urlHash}&settings=${settingsStr}`;
        if (!/^https:\/\/swap.onekey.so/.test(prevUrl)) {
            setIsLoading(true);
            ref?.loadURL(currentUrl);
        }
    }, [urlHash, isLoading, ref, theme, language]);

    useEffect(() => {
        if (!ref) return;

        function didFailLoading() {
            setLoadFailed(true);
        }

        function domReadyEvent() {
            setIsLoading(false);
        }

        async function registerEvent(event: Electron.IpcMessageEvent) {
            if (!ref) return;
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
                    ref.send('sign/broadcast', {
                        id,
                        txid,
                    });
                } catch (e) {
                    ref.send('sign/broadcast', {
                        id,
                        error: e,
                    });
                }
            }
        }

        ref.addEventListener('dom-ready', domReadyEvent);
        ref.addEventListener('did-fail-load', didFailLoading);
        ref.addEventListener('ipc-message', registerEvent);
        return () => {
            ref.removeEventListener('dom-ready', domReadyEvent);
            ref.removeEventListener('did-fail-load', didFailLoading);
            ref.removeEventListener('ipc-message', registerEvent);
        };
    }, [ref, network?.chainId, signWithPush]);

    return (
        <Swap
            key="swap"
            menu={
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
                    <webview
                        id="onekey-swap"
                        ref={handleRef}
                        src="about:blank"
                        nodeintegration
                        disablewebsecurity
                        allowpopups
                        preload={`file://${window.INJECT_PATH}`}
                        style={{ width: '100%', height: '100%' }}
                    />
                </OuterContainer>
            }
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
