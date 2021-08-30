import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sendFormEthereumActions from '@wallet-actions/send/sendFormEthereumActions';
import { AppState, Dispatch } from '@suite-types';
import Explore from '@explore-views';
import { openDeferredModal } from '@suite-actions/modalActions';
import { addFavorite, getFavorite, removeFavorite } from '@explore-actions/FavoriteActions';
import Tabs, { TabPane } from 'rc-tabs';
import { RenderTabBar } from 'rc-tabs/lib/interface';
import Container from './webview';

const mapStateToProps = (state: AppState) => ({
    defaultAccount: state.wallet.selectedAccount,
    selectedAccount: state.explore.selectedAccount,
    language: state.suite.settings.language,
    theme: state.suite.settings.theme.variant,
    favorites: state.explore.favorite,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            signWithPush: sendFormEthereumActions.signAndPublishTransactionInSwap,
            openDeferredModal,
            addFavorite,
            getFavorite,
            removeFavorite,
        },
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const StyledTabs = styled(Tabs)`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;

    .rc-tabs-content-holder {
        display: flex;
        flex: 1;
    }

    .rc-tabs-content {
        flex: 1;
    }
`;

const StyledTabPane = styled(TabPane)`
    height: 100%;
`;

const StyledTabBar = styled.div<{ show: boolean }>`
    padding-top: 0.5vw;
    display: ${props => (props.show ? 'flex' : 'none')};
    overflow: auto;
`;

const StyledTabNode = styled.div<{ active: boolean }>`
    position: relative;
    min-width: 10vw;
    max-width: 20vw;
    height: 3vw;
    font-size: 1vw;
    padding: 0 0.7vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${props => (props.active ? props.theme.BG_WHITE : props.theme.BG_GREY)};
    border-radius: 0.5vw 0.5vw 0 0;
    cursor: pointer;
    ${props =>
        !props.active &&
        css`
            &:after {
                content: '';
                background: ${props => props.theme.TYPE_DARK_GREY};
                position: absolute;
                bottom: 25%;
                right: 0;
                height: 50%;
                width: 1px;
            }
        `}
`;

const Favicon = styled.img`
    width: 2vw;
    height: 2vw;
    padding-right: 0.7vw;
    object-fit: contain;
`;

const TabTitle = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const CloseButton = styled.div`
    &:after {
        content: '✖';
    }
`;

class ExploreContainer extends React.Component<Props, { tabs: any[], activeTab: string }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tabs: [],
            activeTab: 'home'
        }
    }

    openTab = (dapp: any) => {
        const { tabs } = this.state
        const filtered = tabs.filter((tab: any) => tab.code === dapp.code);
        if (filtered.length > 0) {
            this.setState({ activeTab: dapp.code })
        } else {
            this.setState({
                tabs: ([] as any[]).concat(tabs, dapp),
                activeTab: dapp.code
            })
        }
    }

    closeTab = (dapp: any) => {
        const { tabs, activeTab } = this.state
        if (activeTab === dapp.code) {
            const tabIndex = tabs.findIndex((tab: any) => tab.code === dapp.code)
            let nextActiveTab = 'home'
            if (tabIndex >= 1) {
                nextActiveTab = tabs[tabIndex - 1].code
            }
            this.setState({ activeTab : nextActiveTab })
        }
        const newTabs = tabs.filter((tab: any) => tab.code !== dapp.code)
        this.setState({ tabs: newTabs })
        
    }

    updateTabs = (index: number) => {
        return (_tab: any) => {
            const { tabs } = this.state
            const tab = typeof _tab === 'function' ? _tab(tabs[index]) : _tab;
            const newTabs = [...tabs];
            newTabs.splice(index, 1, tab);
            this.setState({ tabs: newTabs })
        }
    }

    render() {
        const { tabs, activeTab } = this.state;
        const { defaultAccount } = this.props;
        const tabsMap = tabs.reduce((res, item) => {
            res[item.code] = item
            return res
        }, {})
        const renderTabBar: RenderTabBar = props => {
            return (
                <StyledTabBar show={tabs.length > 0}>
                    {props.panes.flat(1).map((node: ReactElement) => {
                        
                        const dapp = tabsMap[node.key as string];
                        return (
                            <StyledTabNode
                                key={node.key}
                                active={activeTab === node.key}
                                onClick={() => props.onTabClick(node.key)}
                            >
                                {dapp?.favicon && dapp?.favicon.startsWith('http') && (
                                    <Favicon src={dapp?.favicon} />
                                )}
                                <TabTitle>{dapp?.title ?? dapp?.name ?? node.props.tab}</TabTitle>
                                {node.key !== 'home' && <CloseButton onClick={(e) => { e.stopPropagation(); this.closeTab(dapp) }} />}
                            </StyledTabNode>
                        );
                    })}
                </StyledTabBar>
            );
        };
        const body = (
            <StyledTabs activeKey={activeTab} onChange={(activeTab) => this.setState({ activeTab })} renderTabBar={renderTabBar}>
                <StyledTabPane tab="home" key="home">
                    <Container {...this.props} openTab={this.openTab} setDapp={() => null} />
                </StyledTabPane>
                {tabs.map((dapp, index) => (
                    <StyledTabPane tab={dapp.name} key={dapp.code} forceRender>
                        <Container
                            key={dapp.code}
                            {...this.props}
                            dapp={dapp}
                            openTab={this.openTab}
                            setDapp={this.updateTabs(index)}
                        />
                    </StyledTabPane>
                ))}
            </StyledTabs>
        );
    
        return <Explore key="explore" menu={body} loaded={defaultAccount.status === 'loaded'} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreContainer);
