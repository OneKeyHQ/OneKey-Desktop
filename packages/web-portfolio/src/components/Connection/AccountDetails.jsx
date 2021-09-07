import React from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';

import Avatar from '@components/Avatar';

import { SUPPORTED_WALLETS } from './constants';
import { injected, walletconnect, walletlink, useActiveWeb3React } from './hooks/connect';
import { shortenAddress, getEtherscanLink } from './utils';

import CoinbaseWalletIcon from './images/coinbaseWalletIcon.svg';
import WalletConnectIcon from './images/walletConnectIcon.svg';

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

const InfoCard = styled.div`
    padding: 1rem;
    border-radius: 20px;
    border: 1px solid #edeef2;
    position: relative;
    display: grid;
    grid-row-gap: 12px;
    margin-bottom: 20px;
`;

const AccountGroupingRow = styled.div`
    justify-content: space-between;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-weight: 400;

    div {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }
`;

const AccountSection = styled.div`
    background-color: #ffffff;
`;

const YourAccount = styled.div`
    h5 {
        margin: 0 0 1rem 0;
        font-weight: 400;
    }

    h4 {
        margin: 0;
        font-weight: 500;
    }
`;

const LowerSection = styled.div`
    padding: 1.5rem;
    flex-grow: 1;
    overflow: auto;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    h5 {
        margin: 0;
        font-weight: 400;
    }
`;

const AccountControl = styled.div`
    display: flex;
    justify-content: space-between;
    min-width: 0;
    width: 100%;

    font-weight: 500;
    font-size: 1.25rem;

    a:hover {
        text-decoration: underline;
    }

    p {
        min-width: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

const AddressLink = styled.div`
    font-size: 0.825rem;
    ${({ alignLeft }) => !alignLeft && 'margin-left: 1rem;'}
    font-size: 0.825rem;
    display: flex;
    color: #888d9b;
    :hover {
        color: #565a69;
    }
`;
const WalletName = styled.div`
    width: initial;
    font-size: 0.825rem;
    font-weight: 500;
`;

const IconWrapper = styled.div`
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    & > img,
    span {
        height: ${({ size }) => (size ? `${size}px` : '32px')};
        width: ${({ size }) => (size ? `${size}px` : '32px')};
    }
`;

const WalletAction = styled.button`
    border: 1px solid #e2f5e5;
    color: #00b812;
    background-color: transparent;
    font-size: 16px;
    border-radius: 12px;
    padding: ${({ padding }) => padding || '10px'};
    width: fit-content;
    font-weight: 400;
    margin-left: 8px;
    font-size: 0.825rem;
    padding: 4px 6px;
    :hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

export default function AccountDetails({ ENSName, openOptions }) {
    const { chainId, account, connector } = useActiveWeb3React();
    // const { pending, confirmed, transactions } = useTransactions();

    function formatConnectorName() {
        const { ethereum } = window;
        const isMetaMask = !!ethereum?.isMetaMask;
        const name = Object.keys(SUPPORTED_WALLETS)
            .filter(
                k =>
                    SUPPORTED_WALLETS[k].connector === connector &&
                    (connector !== injected || isMetaMask === (k === 'METAMASK')),
            )
            .map(k => SUPPORTED_WALLETS[k].name)[0];
        return (
            <WalletName>
                <FormattedMessage
                    id="crowdfund__connect_connected_with"
                    defaultMessage="Connected with"
                />
                &nbsp;
                {name}
            </WalletName>
        );
    }

    function getStatusIcon() {
        if (connector === injected) {
            return (
                <IconWrapper size={16}>
                    <Avatar size={16} address={account} rounded />
                </IconWrapper>
            );
        }
        if (connector === walletconnect) {
            return (
                <IconWrapper size={16}>
                    <img src={WalletConnectIcon} alt="wallet connect logo" />
                </IconWrapper>
            );
        }
        if (connector === walletlink) {
            return (
                <IconWrapper size={16}>
                    <img src={CoinbaseWalletIcon} alt="coinbase wallet logo" />
                </IconWrapper>
            );
        }
        return null;
    }

    return (
        <UpperSection>
            <AccountSection>
                <YourAccount>
                    <InfoCard>
                        <AccountGroupingRow>
                            {formatConnectorName()}
                            <div>
                                {connector !== injected && connector !== walletlink && (
                                    <WalletAction
                                        style={{
                                            fontSize: '.825rem',
                                            fontWeight: 400,
                                            marginRight: '8px',
                                        }}
                                        onClick={() => {
                                            connector.close();
                                        }}
                                    >
                                        Disconnect
                                    </WalletAction>
                                )}
                                <WalletAction
                                    style={{ fontSize: '.825rem', fontWeight: 400 }}
                                    onClick={() => {
                                        openOptions();
                                    }}
                                >
                                    <FormattedMessage
                                        id="crowdfund__connect__action_change_wallet"
                                        defaultMessage="Change"
                                    />
                                </WalletAction>
                            </div>
                        </AccountGroupingRow>
                        <AccountGroupingRow id="web3-account-identifier-row">
                            <AccountControl>
                                {ENSName ? (
                                    <div>
                                        {getStatusIcon()}
                                        <p> {ENSName}</p>
                                    </div>
                                ) : (
                                    <div>
                                        {getStatusIcon()}
                                        <p> {account && shortenAddress(account)}</p>
                                    </div>
                                )}
                            </AccountControl>
                        </AccountGroupingRow>
                        <AccountGroupingRow>
                            {ENSName ? (
                                <AccountControl>
                                    <div>
                                        {account && (
                                            <CopyToClipboard
                                                text={account}
                                                className="cursor-pointer"
                                            >
                                                <AddressLink alignLeft>
                                                    <span style={{ marginLeft: '4px' }}>
                                                        <FormattedMessage
                                                            id="crowdfund__connect_copy_address"
                                                            defaultMessage="Copy Address"
                                                        />
                                                    </span>
                                                </AddressLink>
                                            </CopyToClipboard>
                                        )}
                                        {chainId && account && (
                                            <AddressLink
                                                hasENS={!!ENSName}
                                                isENS
                                                className="cursor-pointer"
                                                href={
                                                    chainId &&
                                                    getEtherscanLink(chainId, ENSName, 'address')
                                                }
                                            >
                                                <span style={{ marginLeft: '4px' }}>
                                                    <FormattedMessage
                                                        id="crowdfund__connect_link_etherscan"
                                                        defaultMessage="View on Etherscan"
                                                    />
                                                </span>
                                            </AddressLink>
                                        )}
                                    </div>
                                </AccountControl>
                            ) : (
                                <AccountControl>
                                    <div>
                                        {account && (
                                            <CopyToClipboard
                                                text={account}
                                                className="cursor-pointer"
                                            >
                                                <AddressLink alignLeft>
                                                    <span style={{ marginLeft: '4px' }}>
                                                        <FormattedMessage
                                                            id="crowdfund__connect_copy_address"
                                                            defaultMessage="Copy Address"
                                                        />
                                                    </span>
                                                </AddressLink>
                                            </CopyToClipboard>
                                        )}
                                        {chainId && account && (
                                            <AddressLink
                                                hasENS={!!ENSName}
                                                className="cursor-pointer"
                                                isENS={false}
                                            >
                                                <a
                                                    href={getEtherscanLink(
                                                        chainId,
                                                        account,
                                                        'address',
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <span style={{ marginLeft: '4px' }}>
                                                        <FormattedMessage
                                                            id="crowdfund__connect_link_etherscan"
                                                            defaultMessage="View on Etherscan"
                                                        />
                                                    </span>
                                                </a>
                                            </AddressLink>
                                        )}
                                    </div>
                                </AccountControl>
                            )}
                        </AccountGroupingRow>
                    </InfoCard>
                </YourAccount>
            </AccountSection>
        </UpperSection>
    );
}
