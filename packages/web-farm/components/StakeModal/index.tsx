import React, { FC } from 'react';
import cx, { Argument } from 'classnames';
import {
    Modal,
    Button,
    TradeForm,
    RadioButtonGroup,
    TokenGroup,
    Table,
    Card,
    Input,
} from '@onekeyhq/ui-components';
import { TransactionSettings, DescriptionList } from '../index';

type StakeModalProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
    /**
     * 是否可见
     */
    visible?: boolean;
    /**
     * 点击模态框遮罩时或键盘按下 Esc 时的回调
     */
    onClose: () => void;
};

const defaultProps = {} as const;

const StakeModal: FC<StakeModalProps> = ({ className, visible, onClose, ...rest }) => {
    const [selectedPercentage, setSelectedPercentage] = React.useState('min');

    return (
        <>
            <Modal
                visible={visible}
                onClose={onClose}
                className={cx('sm:!max-w-md', !!className && className)}
                {...rest}
            >
                <Modal.Header
                    title="Stake"
                    onClose={onClose}
                    actions={
                        <div className="okd-flex okd-space-x-6">
                            <div className="okd-flex okd-w-5 okd-h-5 okd-items-center okd-justify-center">
                                <Button circular type="plain" leadingIcon="RefreshSolid" />
                            </div>
                            <div className="okd-flex okd-w-5 okd-h-5 okd-items-center okd-justify-center">
                                <TransactionSettings gas />
                            </div>
                        </div>
                    }
                />
                <Modal.Body>
                    <div className="space-y-6">
                        <TradeForm
                            labelCorner={
                                <div className="flex flex-wrap justify-between flex-1">
                                    <RadioButtonGroup
                                        value={selectedPercentage}
                                        onChange={setSelectedPercentage}
                                        label="example"
                                        className="w-full sm:w-auto"
                                    >
                                        <RadioButtonGroup.Option
                                            className="flex-1"
                                            value="min"
                                            label="25%"
                                        />
                                        <RadioButtonGroup.Option
                                            className="flex-1"
                                            value="medium"
                                            label="50%"
                                        />
                                        <RadioButtonGroup.Option
                                            className="flex-1"
                                            value="large"
                                            label="75%"
                                        />
                                        <RadioButtonGroup.Option
                                            className="flex-1"
                                            value="max"
                                            label="100%"
                                        />
                                    </RadioButtonGroup>
                                    <Input
                                        value={selectedPercentage}
                                        addonAfter="%"
                                        className="w-full mt-2 sm:w-20 sm:mt-0"
                                        paddingRight={32}
                                    />
                                </div>
                            }
                        >
                            <TradeForm.Input
                                placeholder="0.0"
                                showBalance
                                showRate
                                valueType={
                                    <div className="okd-flex okd-items-center">
                                        <TokenGroup
                                            cornerToken={{ chain: 'asdfasdfsf' }}
                                            description="something"
                                            sources={[
                                                { chain: 'bsc', name: 'BSC' },
                                                { chain: 'eth', name: 'ETH' },
                                            ]}
                                        />
                                    </div>
                                }
                            />
                        </TradeForm>
                        <div>
                            <h5 className="mb-2 text-sm font-medium text-gray-700">
                                Estimated Reward
                            </h5>
                            <Card className="overflow-hidden">
                                <div className="-m-4 sm:-m-6">
                                    <Table
                                        size="sm"
                                        columns={[
                                            {
                                                dataIndex: 'timeframe',
                                                title: 'Timeframe',
                                            },
                                            {
                                                dataIndex: 'roi',
                                                title: 'ROI',
                                                contentType: 'numeric',
                                                render: value => {
                                                    return (
                                                        <div className="okd-text-gray-900">
                                                            {value}
                                                        </div>
                                                    );
                                                },
                                            },
                                            {
                                                dataIndex: 'reward',
                                                title: 'Reward',
                                                contentType: 'numeric',
                                                render: value => {
                                                    return (
                                                        <>
                                                            <div className="okd-text-gray-900">
                                                                {value.balance}
                                                            </div>
                                                            <span>{value.rate}</span>
                                                        </>
                                                    );
                                                },
                                            },
                                        ]}
                                        dataSource={[
                                            {
                                                timeframe: '1d',
                                                roi: '0.20%',
                                                reward: {
                                                    balance: '0.15 CAKE',
                                                    rate: '$1.50',
                                                },
                                            },
                                            {
                                                timeframe: '7d',
                                                roi: '1.43%',
                                                reward: {
                                                    balance: '0.85 CAKE',
                                                    rate: '$8.50',
                                                },
                                            },
                                            {
                                                timeframe: '30d',
                                                roi: '6.29%',
                                                reward: {
                                                    balance: '2.93 CAKE',
                                                    rate: '$46.35',
                                                },
                                            },
                                            {
                                                timeframe: '365d (APY)',
                                                roi: '109.8%',
                                                reward: {
                                                    balance: '54.75 CAKE',
                                                    rate: '$808.85',
                                                },
                                            },
                                        ]}
                                    />
                                </div>
                            </Card>
                        </div>
                        <DescriptionList>
                            <DescriptionList.Item itemKey="Speed" itemValue="Fast" />
                        </DescriptionList>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex space-x-3">
                        <Button className="flex-1" type="primary">
                            Approve
                        </Button>
                        <Button className="flex-1" disabled type="primary">
                            Stake
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

StakeModal.defaultProps = defaultProps;

export default StakeModal;
