import React, { useState } from 'react';
import { Button, P } from '@trezor/components';
import { Translation } from '@suite-components';
import { NETWORKS } from '@wallet-config';
import { Account, Network } from '@wallet-types';
import NetworkUnavailable from './components/NetworkUnavailable';
import NetworkInternal from './components/NetworkInternal';
import AddAccountButton from './components/AddAccountButton';
import Wrapper from './components/Wrapper';
import { Props } from './Container';
import { DEFAULT_BTC_ACCOUNT_TYPE, BALANCE_TO_HIDE } from '@wallet-constants/account';
import { useSelector } from '@suite-hooks';
import { toFiatCurrency } from '@wallet-utils/fiatConverterUtils';
import styled from 'styled-components';

const HiddenTip = styled(P)`
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    margin: 10px 0 20px;
    text-align: left;
`;

const AddAccount = (props: Props) => {
    // Collect all Networks without "accountType" (normal)
    const internalNetworks = NETWORKS.filter(n => !n.accountType && !n.isHidden);

    // Collect device unavailable capabilities
    const unavailableCapabilities = props.device.features
        ? props.device.unavailableCapabilities
        : {};

    // if symbol is passed in the props, preselect it and pin it (do not allow the user to change it)
    // otherwise default value is currently selected network or first network item on the list (btc)
    const symbol = props.symbol ? props.symbol : props.selectedAccount.account?.symbol;
    const preselectedNetwork = symbol
        ? (internalNetworks.find(n => n.symbol === symbol) as Network)
        : internalNetworks[0];

    const [network, setNetwork] = useState<Network>(preselectedNetwork);
    const [accountType, setAccountType] = useState<Network | undefined>(undefined);

    const { fiat, hide0BalanceWallet } = useSelector(state => ({
        fiat: state.wallet.fiat,
        hide0BalanceWallet: state.wallet.settings.hide0BalanceWallet,
    }));

    const currentFiatRates = fiat.coins.find(f => f.symbol.toLowerCase() === symbol?.toLowerCase())
        ?.current;

    const targetCurrency = 'usd';
    const { account } = props.selectedAccount;

    let fiatCurrency;
    if (account) {
        fiatCurrency = toFiatCurrency(
            account.formattedBalance,
            targetCurrency,
            currentFiatRates?.rates,
        );
    }

    const hideNewAccount = hide0BalanceWallet && fiatCurrency && +fiatCurrency < BALANCE_TO_HIDE;

    // Common props for Wrapper
    const wrapperProps = {
        selectedNetwork: network,
        internalNetworks,
        onSelectNetwork: (network: Network) => {
            setNetwork(network);
            setAccountType(undefined);
        },
        onSelectAccountType: setAccountType,
        onCancel: props.onCancel,
    };

    // Check device capabilities
    // Display: unavailable network
    const capability = unavailableCapabilities[network.symbol];
    if (capability) {
        return (
            <Wrapper {...wrapperProps}>
                <NetworkUnavailable capability={capability} network={network} />
            </Wrapper>
        );
    }

    // Display: Network is not enabled in settings
    if (!props.enabledNetworks.includes(network.symbol)) {
        const onEnableNetwork = () => {
            props.onCancel();
            props.changeCoinVisibility(network.symbol, true);
            if (props.app === 'wallet' && !props.noRedirect) {
                // redirect to account only if added from "wallet" app
                props.goto('wallet-index', {
                    symbol: network.symbol,
                    accountIndex: 0,
                    accountType: 'normal',
                });
            }
        };

        return (
            <Wrapper
                {...wrapperProps}
                actionButton={
                    <Button variant="primary" onClick={onEnableNetwork}>
                        <Translation
                            id="TR_ENABLE_NETWORK_BUTTON"
                            values={{ networkName: network.name }}
                        />
                    </Button>
                }
                pinNetwork={!!props.symbol}
            />
        );
    }

    // Collect all empty accounts related to selected device and selected accountType
    const currentType = () => {
        if (accountType) {
            return accountType.accountType ?? 'normal';
        }
        return network.symbol === 'btc' ? DEFAULT_BTC_ACCOUNT_TYPE : 'normal';
    };
    const emptyAccounts = props.accounts.filter(
        a =>
            a.deviceState === props.device.state &&
            a.symbol === network.symbol &&
            a.accountType === currentType() &&
            a.empty,
    );

    // Collect possible accountTypes
    const accountTypes =
        network.networkType === 'bitcoin'
            ? NETWORKS.filter(n => n.symbol === network.symbol)
            : undefined;

    const onEnableAccount = (account: Account) => {
        props.onCancel();
        props.changeAccountVisibility(account);
        if (props.app === 'wallet' && !props.noRedirect) {
            // redirect to account only if added from "wallet" app
            props.goto('wallet-index', {
                symbol: account.symbol,
                accountIndex: account.index,
                accountType: account.accountType,
            });
        }
    };

    // Display: default add account window
    return (
        <Wrapper
            {...wrapperProps}
            selectedAccountType={accountType}
            accountTypes={accountTypes}
            actionButton={
                <AddAccountButton
                    network={network}
                    accounts={emptyAccounts}
                    onEnableAccount={onEnableAccount}
                />
            }
            pinNetwork={!!props.symbol}
        >
            <>
                <NetworkInternal network={accountType || network} accountTypes={accountTypes} />
                {hideNewAccount && (
                    <HiddenTip>
                        <Translation id="TR_ACCOUNTS_HIDE_TIP" />
                    </HiddenTip>
                )}
            </>
        </Wrapper>
    );
};

export default AddAccount;
