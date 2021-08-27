import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { H2, variables, scrollbarStyles } from '@trezor/components';
import { Translation, AddAccountButton } from '@suite-components';
import { useDiscovery, useLayoutSize,  } from '@suite-hooks';
import { sortByCoin, getFailedAccounts } from '@wallet-utils/accountUtils';
import { AppState } from '@suite-types';
import { Account } from '@wallet-types';

import AccountGroup from './components/AccountGroup';
import AccountItem from './components/AccountItem/Container';
import { SkeletonAccountItem } from './components/AccountItem';

const Wrapper = styled.div<{ isMobileLayout?: boolean }>`
    display: flex;
    flex-direction: column;
    z-index: 4; /*  higher than accounts list to prevent box-shadow overflow */
    width: 100%;
    background: ${props => props.theme.BG_LIGHT_GREY};

    ${props =>
        !props.isMobileLayout &&
        css`
            overflow: auto;
        `}
`;

const MenuHeader = styled.div<{ isMobileLayout?: boolean }>`
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    background: ${props => props.theme.BG_WHITE};
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};

    ${props =>
        props.isMobileLayout &&
        css`
            padding: 12px 16px;
        `}

    ${props =>
        !props.isMobileLayout &&
        css`
            padding: 32px 16px 8px 16px;
            margin-bottom: 8px;
        `}
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Heading = styled(H2)<{ isMobileLayout?: boolean }>`
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_DARK_GREY};
    ${props =>
        props.isMobileLayout &&
        css`
            font-size: 18px;
        `}
`;

const Scroll = styled.div`
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0px 8px;

    ${scrollbarStyles}
`;

const NoResults = styled.div`
    display: flex;
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    justify-content: center;
    text-align: center;
    margin: 36px 0px;
`;

const mapStateToProps = (state: AppState) => ({
    device: state.suite.device,
    accounts: state.wallet.accounts,
    defaultAccount: state.wallet.selectedAccount,
    selectedAccount: state.explore.selectedAccount
});

type Props = ReturnType<typeof mapStateToProps>;

const AccountsSelector = ({ device, accounts, selectedAccount, defaultAccount }: Props) => {
    const { discovery, getDiscoveryStatus } = useDiscovery();
    const { current } = selectedAccount;
    const { account } = defaultAccount;

    const currentAddress =  current || account?.descriptor;

    let { isMobileLayout } = useLayoutSize();

    const discoveryStatus = getDiscoveryStatus();
    const discoveryInProgress = discoveryStatus && discoveryStatus.status === 'loading';

    const selectedItemRef = useCallback((_item: HTMLDivElement | null) => {
        // TODO: scroll to selected item
    }, []);

    if (!device || !discovery) {
        // TODO: default empty state while retrieving data from the device
        return (
            <Wrapper isMobileLayout={isMobileLayout}>
                <Scroll>
                    <MenuHeader isMobileLayout={isMobileLayout}>
                        <Heading noMargin isMobileLayout={isMobileLayout}>
                            <Translation id="TR_MY_ACCOUNTS" />
                        </Heading>
                    </MenuHeader>
                    {!isMobileLayout && <SkeletonAccountItem />}
                </Scroll>
            </Wrapper>
        );
    }

    const isSelected = (account: Account) => account.descriptor === currentAddress
      

    const failed = getFailedAccounts(discovery);

    const list = sortByCoin(accounts.filter(a => a.deviceState === device.state).concat(failed));

    // always show first "normal" account even if they are empty
    const normalAccounts = list.filter(
        a => a.accountType === 'normal' && a.symbol === 'eth' && (!a.empty || a.visible),
    );
    // const uniqueNetworks = [...new Set(filteredAccounts.map(item => item.symbol))];

    const buildGroup = (type: Account['accountType'], accounts: Account[]) => {
        const groupHasBalance = accounts.find(a => a.availableBalance !== '0');

        if (!accounts.length) {
            // show skeleton in 'normal' group while we wait for a discovery of first account
            return <>{discoveryInProgress && type === 'normal' && <SkeletonAccountItem />}</>;
        }

        return (
            <AccountGroup
                key={type}
                type={type}
                hasBalance={!!groupHasBalance}
                keepOpened
            >
                {accounts.map(account => {
                    const selected = !!isSelected(account);
                    const forwardedRef = selected ? selectedItemRef : undefined;
                    return (
                        <AccountItem
                            key={`${account.descriptor}-${account.symbol}`}
                            account={account}
                            selected={selected}
                            forwardedRef={forwardedRef}
                        />
                    );
                })}
                {discoveryInProgress && <SkeletonAccountItem />}
            </AccountGroup>
        );
    };

    const listedAccountsLength = normalAccounts.length;

    const accountsComponent =
        listedAccountsLength > 0 ? (
            <>
                {buildGroup('normal', normalAccounts)}
            </>
        ) : (
            <NoResults>
                <Translation id="TR_ACCOUNT_SEARCH_NO_RESULTS" />
            </NoResults>
        );

    return (
        <Wrapper>
            <Scroll>
                <MenuHeader>
                    <Row>
                        <Heading noMargin>
                            <Translation id="TR_SELECT_ACCOUNT" />
                        </Heading>
                    </Row>
                </MenuHeader>
                {accountsComponent}
            </Scroll>
        </Wrapper>
    );
};

export default connect(mapStateToProps)(AccountsSelector);
