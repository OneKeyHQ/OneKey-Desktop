/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import { isMobile } from 'react-device-detect';
import { FormattedMessage } from 'react-intl';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { injected, useConnectionModal } from './hooks/connect';
import { SUPPORTED_WALLETS } from './constants';
import { usePrevious } from './hooks/common';

import Modal from '@components/GlobalModal';

import AccountDetails from './AccountDetails';
import Option from './Option';
import PendingView from './PendingView';

const Wrapper = styled.div`
    margin: 0;
    padding: 0;
    width: 100%;
`;

const HeaderRow = styled.div`
    color: black;
    font-weight: 500;
`;

const ContentWrapper = styled.div`
    padding: 2rem;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
`;

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 400;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`;

const OptionGrid = styled.div`
    display: grid;
    grid-gap: 10px;
`;

const HoverText = styled.div`
    :hover {
        cursor: pointer;
    }
`;

const WALLET_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    ACCOUNT: 'account',
    PENDING: 'pending',
};

const ConnectionModal = () => {
    const { visible: walletModalOpen, handleClose } = useConnectionModal();
    const { active, account, connector, activate, error } = useWeb3React();
    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

    const [pendingWallet, setPendingWallet] = useState();

    const [pendingError, setPendingError] = useState();

    const previousAccount = usePrevious(account);

    useEffect(() => {
        if (account && !previousAccount && walletModalOpen) {
            handleClose();
        }
    }, [account, previousAccount, handleClose, walletModalOpen]);

    useEffect(() => {
        if (walletModalOpen) {
            setPendingError(false);
            setWalletView(WALLET_VIEWS.ACCOUNT);
        }
    }, [walletModalOpen]);

    const activePrevious = usePrevious(active);
    const connectorPrevious = usePrevious(connector);
    useEffect(() => {
        if (
            walletModalOpen &&
            ((active && !activePrevious) ||
                (connector && connector !== connectorPrevious && !error))
        ) {
            setWalletView(WALLET_VIEWS.ACCOUNT);
        }
    }, [
        setWalletView,
        active,
        error,
        connector,
        walletModalOpen,
        activePrevious,
        connectorPrevious,
    ]);

    const tryActivation = useCallback(
        connector => {
            setPendingWallet(connector);
            setWalletView(WALLET_VIEWS.PENDING);

            if (
                connector instanceof WalletConnectConnector &&
                connector.walletConnectProvider?.wc?.uri
            ) {
                connector.walletConnectProvider = undefined;
            }

            connector &&
                activate(connector, undefined, true).catch(error => {
                    if (error instanceof UnsupportedChainIdError) {
                        activate(connector);
                    } else {
                        setPendingError(true);
                    }
                });
        },
        [activate],
    );

    const getOptions = useCallback(() => {
        const isOnekeyOrMetaMask = window?.ethereum?.isMetaMask;
        return Object.keys(SUPPORTED_WALLETS).map(key => {
            const option = SUPPORTED_WALLETS[key];

            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === 'MetaMask' || option.name === 'OneKey') {
                        return (
                            <Option
                                id={`connect-${key}`}
                                key={key}
                                color="#00B812"
                                header={
                                    <FormattedMessage
                                        id="crowdfund__connect__option_item__install_onekey"
                                        defaultMessage="Install OneKey"
                                    />
                                }
                                subheader={null}
                                link="https://www.onekey.so/plugin"
                                // eslint-disable-next-line @typescript-eslint/no-require-imports
                                icon={require('./images/onekey.svg')}
                            />
                        );
                    }
                    return null;
                }
                if (option.name === 'MetaMask' && !isOnekeyOrMetaMask) {
                    return null;
                }
                if (option.name === 'Injected' && isOnekeyOrMetaMask) {
                    return null;
                }
            }

            // Hack around for translation
            if (option.name === 'OneKey')
                return (
                    <Option
                        id={`connect-${key}`}
                        onClick={() => {
                            option.connector === connector
                                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                                : !option.href && tryActivation(option.connector);
                        }}
                        key={key}
                        active={option.connector === connector}
                        color={option.color}
                        link={option.href}
                        header={<FormattedMessage id="crowdfund__connect__option_item__onekey" />}
                        subheader={null}
                        icon={option.iconName}
                    />
                );

            return (
                !isMobile &&
                !option.mobileOnly && (
                    <Option
                        id={`connect-${key}`}
                        onClick={() => {
                            option.connector === connector
                                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                                : !option.href && tryActivation(option.connector);
                        }}
                        key={key}
                        active={option.connector === connector}
                        color={option.color}
                        link={option.href}
                        header={option.name}
                        subheader={null}
                        icon={option.iconName}
                    />
                )
            );
        });
    }, [connector, tryActivation]);

    const getModalContent = useCallback(() => {
        if (error) {
            return (
                <UpperSection>
                    <HeaderRow>
                        {error instanceof UnsupportedChainIdError ? (
                            <FormattedMessage id="crowdfund__connect_error_network_title" />
                        ) : (
                            <FormattedMessage
                                id="crowdfund__connect_error_connecting"
                                defaultMessage="Error Connecting"
                            />
                        )}
                    </HeaderRow>
                    <ContentWrapper>
                        {error instanceof UnsupportedChainIdError ? (
                            <h5>
                                <FormattedMessage id="crowdfund__connect_error_network" />
                            </h5>
                        ) : (
                            <FormattedMessage
                                id="crowdfund__connect_fail_tip"
                                defaultMessage="Error connecting. Try refreshing the page."
                            />
                        )}
                    </ContentWrapper>
                </UpperSection>
            );
        }
        if (account && walletView === WALLET_VIEWS.ACCOUNT) {
            return (
                <AccountDetails
                    toggleWalletModal={handleClose}
                    ENSName={null}
                    openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
                />
            );
        }
        return (
            <UpperSection>
                <ContentWrapper>
                    {walletView === WALLET_VIEWS.PENDING ? (
                        <PendingView
                            connector={pendingWallet}
                            error={pendingError}
                            setPendingError={setPendingError}
                            tryActivation={tryActivation}
                        />
                    ) : (
                        <OptionGrid>{getOptions()}</OptionGrid>
                    )}
                </ContentWrapper>
            </UpperSection>
        );
    }, [
        error,
        getOptions,
        account,
        walletView,
        handleClose,
        pendingError,
        pendingWallet,
        tryActivation,
    ]);

    return (
        <Modal
            visible={walletModalOpen}
            onClose={handleClose}
            title={
                walletView !== WALLET_VIEWS.ACCOUNT ? (
                    <HeaderRow color="blue">
                        <HoverText
                            onClick={() => {
                                setPendingError(false);
                                setWalletView(WALLET_VIEWS.ACCOUNT);
                            }}
                        >
                            <FormattedMessage
                                id="crowdfund__connect_back_literal"
                                defaultMessage="Back"
                            />
                        </HoverText>
                    </HeaderRow>
                ) : account ? (
                    <HeaderRow>
                        <HoverText>
                            <FormattedMessage
                                id="crowdfund__connect_account_literal"
                                defaultMessage="Account"
                            />
                        </HoverText>
                    </HeaderRow>
                ) : (
                    <HeaderRow>
                        <HoverText>
                            <FormattedMessage
                                id="crowdfund__connect_a_wallet"
                                defaultMessage="Connect to a wallet"
                            />
                        </HoverText>
                    </HeaderRow>
                )
            }
            closable
            maskClosable
            destroyOnClose
            className="transform translate-y-30"
        >
            <Wrapper>{getModalContent()}</Wrapper>
        </Modal>
    );
};

export default ConnectionModal;
