import React from 'react';
import {
    UIProvider,
    Button,
    TokenGroup,
    Switch,
    Input,
    Icon,
    Card,
    Table,
    Layout,
    Section,
} from '@onekeyhq/ui-components';
import { InvestmentCard, StakeModal, UnstakeModal, ClaimModal } from '../components/index';

export default function Home() {
    const [stakeModal, setStakeModal] = React.useState(false);

    const showStakeModal = () => {
        setStakeModal(true);
    };
    const hideStakeModal = () => {
        setStakeModal(false);
    };

    const [unstakeModal, setUnstakeModal] = React.useState(false);

    const showUnstakeModal = () => {
        setUnstakeModal(true);
    };
    const hideUnstakeModal = () => {
        setUnstakeModal(false);
    };

    const [claimModal, setClaimModal] = React.useState(false);

    const showClaimModal = () => {
        setClaimModal(true);
    };
    const hideClaimModal = () => {
        setClaimModal(false);
    };

    const TokenGroupDatas = {
        sources: [
            {
                src:
                    'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/bnb.png',
                name: 'BNB',
            },
        ],
        description: 'Platform name',
    };
    const apyDatas = {
        total: 93.59,
        daily: 0.18,
    };

    return (
        <UIProvider>
            <Layout
                page={{
                    pageHeader: {
                        title: 'Farm',
                        actions: <Button type="primary">Connect</Button>,
                    },
                }}
            >
                <Section
                    sectionHeader={{
                        title: 'Active Farms',
                    }}
                >
                    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                        <InvestmentCard
                            type="claim"
                            primaryAction={showClaimModal}
                            secondaryAction={showUnstakeModal}
                            tokenGroup={{
                                sources: [
                                    {
                                        chain: 'eth',
                                        name: 'ETH',
                                    },
                                ],
                                description: 'Unknown',
                            }}
                            descriptions={[
                                {
                                    key: 'Total Amounts',
                                    value: '234.11',
                                },
                                {
                                    key: 'Total Value',
                                    value: '$1000',
                                },
                            ]}
                        />
                    </div>
                </Section>
                <Section
                    sectionHeader={{
                        className: '!mb-4',
                        title: (
                            <div className="flex items-center">
                                Opportunities
                                <Switch className="ml-auto sm:ml-4" label="Stable Asset" />
                            </div>
                        ),
                        actions: (
                            <Input
                                addonBefore={
                                    <Icon className="text-gray-400" name="SearchSolid" size={20} />
                                }
                                className="w-full sm:w-72 lg:w-80"
                                placeholder="Filter by token,  platform"
                                type="search"
                            />
                        ),
                    }}
                >
                    <Card className="overflow-hidden">
                        <div className="-m-4 sm:-m-6">
                            <Table
                                rowkey="placeholder"
                                columns={[
                                    {
                                        title: 'Pool',
                                        dataIndex: 'tokenGroup',
                                        render: value => {
                                            return (
                                                <div className="okd-flex">
                                                    <TokenGroup
                                                        size="lg"
                                                        cornerToken={value.cornerToken}
                                                        sources={value.sources}
                                                        description={value.description}
                                                    />
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        title: 'TVL',
                                        dataIndex: 'tvl',
                                        contentType: 'numeric',
                                    },
                                    {
                                        title: 'APY',
                                        dataIndex: 'apy',
                                        render: value => {
                                            return (
                                                <>
                                                    <div className="okd-text-gray-900">
                                                        {value.total}%
                                                    </div>
                                                    <span>{value.daily}% Daily</span>
                                                </>
                                            );
                                        },
                                        tooltip: {
                                            content:
                                                'APY stands for annual percentage yield. It is calculated by profit and loss from all your accounts.<br />Currently it may deviate from the real situation due to the different statistics of each platform.',
                                            multiline: true,
                                            className: 'okd-max-w-sm',
                                        },
                                        contentType: 'numeric',
                                    },
                                    {
                                        title: 'Uptime',
                                        dataIndex: 'uptime',
                                        sortOrder: true,
                                        contentType: 'numeric',
                                    },
                                    {
                                        dataIndex: 'action',
                                        contentType: 'numeric',
                                        render: value => {
                                            return (
                                                <Button size="xs" onClick={value.action}>
                                                    {value.label}
                                                </Button>
                                            );
                                        },
                                    },
                                ]}
                                dataSource={[
                                    {
                                        tokenGroup: TokenGroupDatas,
                                        tvl: '$729,153,278',
                                        apy: apyDatas,
                                        uptime: '59 Days',
                                        action: {
                                            label: 'Stake',
                                            action: showStakeModal,
                                        },
                                    },
                                    {
                                        tokenGroup: TokenGroupDatas,
                                        tvl: '$729,153,278',
                                        apy: apyDatas,
                                        uptime: '59 Days',
                                        action: {
                                            label: 'Stake',
                                            action: showStakeModal,
                                        },
                                    },
                                    {
                                        tokenGroup: TokenGroupDatas,
                                        tvl: '$729,153,278',
                                        apy: apyDatas,
                                        uptime: '59 Days',
                                        action: {
                                            label: 'Stake',
                                            action: showStakeModal,
                                        },
                                    },
                                    {
                                        tokenGroup: TokenGroupDatas,
                                        tvl: '$729,153,278',
                                        apy: apyDatas,
                                        uptime: '59 Days',
                                        action: {
                                            label: 'Stake',
                                            action: showStakeModal,
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </Card>
                </Section>
                <StakeModal visible={stakeModal} onClose={() => hideStakeModal()} />
                <UnstakeModal visible={unstakeModal} onClose={() => hideUnstakeModal()} />
                <ClaimModal visible={claimModal} onClose={() => hideClaimModal()} />
            </Layout>
        </UIProvider>
    );
}
