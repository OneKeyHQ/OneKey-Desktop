import React from 'react';
import {
    UIProvider,
    Button,
    TokenGroup,
    SectionHeader,
    Switch,
    Input,
    Icon,
    Card,
    Table,
    Layout,
    Section,
} from '@onekeyhq/ui-components';
import {
    InvestmentCard,
    AddLiquidityModal,
    RemoveLiquidityModal,
    DepositModal,
    WithDrawModal,
} from '../components/index';

export default function Home() {
    const [addLiquidityModalVisible, setAddLiquidityModalVisible] = React.useState(false);

    const showAddLiquidityModalVisibleModal = () => {
        setAddLiquidityModalVisible(true);
    };
    const hideAddLiquidityModalVisible = () => {
        setAddLiquidityModalVisible(false);
    };

    const [removeLiquidityModalVisible, setRemoveLiquidityModalVisible] = React.useState(false);

    const showRemoveLiquidityModalVisibleModal = () => {
        setRemoveLiquidityModalVisible(true);
    };
    const hideRemoveLiquidityModalVisible = () => {
        setRemoveLiquidityModalVisible(false);
    };

    const [depositModal, setDepositModal] = React.useState(false);

    const showDepositModalModal = () => {
        setDepositModal(true);
    };
    const hideDepositModal = () => {
        setDepositModal(false);
    };

    const [withDrawModal, setWithDrawModal] = React.useState(false);

    const showWithDrawModalModal = () => {
        setWithDrawModal(true);
    };
    const hideWithDrawModal = () => {
        setWithDrawModal(false);
    };

    const TokenGroupDatas = {
        cornerToken: {
            src:
                'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/eth.png',
        },
        sources: [
            {
                src:
                    'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/btc.png',
                name: 'BTC',
            },
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
                        title: 'Pool',
                    },
                }}
            >
                <Section>
                    <SectionHeader title="Active Pools" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                        <InvestmentCard
                            type="liquidity"
                            primaryAction={showAddLiquidityModalVisibleModal}
                            secondaryAction={showRemoveLiquidityModalVisibleModal}
                            tokenGroup={{
                                cornerToken: { chain: 'unknown' },
                                sources: [
                                    {
                                        chain: 'bsc',
                                        name: 'BSC',
                                    },
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
                        <InvestmentCard
                            type="deposit"
                            primaryAction={showDepositModalModal}
                            secondaryAction={showWithDrawModalModal}
                            tokenGroup={{
                                cornerToken: { chain: 'unknown' },
                                sources: [
                                    {
                                        chain: 'bsc',
                                        name: 'BSC',
                                    },
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
                <Section>
                    <SectionHeader
                        className="!mb-4"
                        actions={
                            <Input
                                addonBefore={
                                    <Icon className="text-gray-400" name="SearchSolid" size={20} />
                                }
                                className="w-full sm:w-72 lg:w-80"
                                placeholder="Filter by token,  platform"
                                type="search"
                            />
                        }
                        title={
                            <div className="flex items-center">
                                Opportunities
                                <Switch className="ml-auto sm:ml-4" label="Stable Asset" />
                            </div>
                        }
                    />
                    <Card className="">
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
                                            label: 'Add Liquidity',
                                            action: showAddLiquidityModalVisibleModal,
                                        },
                                    },
                                    {
                                        tokenGroup: TokenGroupDatas,
                                        tvl: '$729,153,278',
                                        apy: apyDatas,
                                        uptime: '59 Days',
                                        action: {
                                            label: 'Deposit',
                                            action: showDepositModalModal,
                                        },
                                    },
                                    {
                                        tokenGroup: TokenGroupDatas,
                                        tvl: '$729,153,278',
                                        apy: apyDatas,
                                        uptime: '59 Days',
                                        action: {
                                            label: 'Add Liquidity',
                                            action: showAddLiquidityModalVisibleModal,
                                        },
                                    },
                                    {
                                        tokenGroup: TokenGroupDatas,
                                        tvl: '$729,153,278',
                                        apy: apyDatas,
                                        uptime: '59 Days',
                                        action: {
                                            label: 'Deposit',
                                            action: showDepositModalModal,
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </Card>
                </Section>
                <AddLiquidityModal
                    visible={addLiquidityModalVisible}
                    onClose={() => hideAddLiquidityModalVisible()}
                />
                <RemoveLiquidityModal
                    visible={removeLiquidityModalVisible}
                    onClose={() => hideRemoveLiquidityModalVisible()}
                />
                <DepositModal visible={depositModal} onClose={() => hideDepositModal()} />
                <WithDrawModal visible={withDrawModal} onClose={() => hideWithDrawModal()} />
            </Layout>
        </UIProvider>
    );
}
