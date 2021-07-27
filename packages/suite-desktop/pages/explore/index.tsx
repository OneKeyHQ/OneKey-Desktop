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
    selectedAccount: state.wallet.selectedAccount,
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

const ExploreContainer: FC<Props> = props => {
    const [tabs, setTabs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('home');
    const openTab = useCallback((dapp: any) => {
        setTabs(p => {
            setActiveTab(`StyledTabPane-${p.length}`);
            return [...p, dapp];
        });
    }, []);
    const closeTab = useCallback(index => {
        setTabs(p => {
            const newTabs = [...p];
            newTabs.splice(index, 1);
            return newTabs;
        });
    }, []);
    const updateTabs = (index: number) => (_tab: any) => {
        setTabs(p => {
            const tab = typeof _tab === 'function' ? _tab(p[index]) : _tab;
            const newTabs = [...p];
            newTabs.splice(index, 1, tab);
            return newTabs;
        });
    };
    useEffect(() => {
        const parts = activeTab.split('-');
        const index = parts[parts.length - 1];
        if (tabs.length <= parseInt(index, 10)) {
            setActiveTab('home');
        }
    }, [activeTab, tabs]);
    const renderTabBar: RenderTabBar = props => {
        return (
            <StyledTabBar show={tabs.length > 0}>
                {props.panes.flat(1).map((node: ReactElement) => {
                    const parts = (node.key as string).split('-');
                    const index = parseInt(parts[parts.length - 1], 10);
                    const dapp = tabs[index];
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
                            {node.key !== 'home' && <CloseButton onClick={() => closeTab(index)} />}
                        </StyledTabNode>
                    );
                })}
            </StyledTabBar>
        );
    };
    const body = (
        <StyledTabs activeKey={activeTab} onChange={setActiveTab} renderTabBar={renderTabBar}>
            <StyledTabPane tab="home" key="home">
                <Container {...props} openTab={openTab} setDapp={() => null} />
            </StyledTabPane>
            {tabs.map((dapp, index) => (
                <StyledTabPane tab={dapp.name} key={`StyledTabPane-${index}`} forceRender>
                    <Container
                        key={`Container-${index}`}
                        {...props}
                        dapp={dapp}
                        openTab={openTab}
                        setDapp={updateTabs(index)}
                    />
                </StyledTabPane>
            ))}
        </StyledTabs>
    );
    return <Explore key="explore" menu={body} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(ExploreContainer);
