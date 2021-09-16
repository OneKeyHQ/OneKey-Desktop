import React, { FC } from 'react';
import cx, { Argument } from 'classnames';
import {
    Modal,
    Button,
    TradeForm,
    RadioButtonGroup,
    TokenSelector,
    TokenGroup,
} from '@onekeyhq/ui-components';
import { TransactionSettings, DescriptionList } from '../index';

type AddLiquidityModalProps = {
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

const AddLiquidityModal: FC<AddLiquidityModalProps> = ({
    className,
    visible,
    onClose,
    ...rest
}) => {
    const [selectedToken, setSelectedToken] = React.useState('single');

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const showTokenSelector = () => {
        setIsModalVisible(true);
    };

    const hideTokenSelector = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            className={cx('sm:!max-w-md', !!className && className)}
            {...rest}
        >
            <Modal.Header
                title="Add Liquidity"
                onClose={onClose}
                actions={
                    <div className="okd-flex okd-space-x-6">
                        <div className="okd-flex okd-w-5 okd-h-5 okd-items-center okd-justify-center">
                            <Button circular type="plain" leadingIcon="RefreshSolid" />
                        </div>
                        <div className="okd-flex okd-w-5 okd-h-5 okd-items-center okd-justify-center">
                            <TransactionSettings priceSlippage gas />
                        </div>
                    </div>
                }
            />
            <Modal.Body>
                <div className="space-y-6">
                    <TradeForm
                        label="From"
                        labelCorner={
                            <RadioButtonGroup
                                value={selectedToken}
                                onChange={setSelectedToken}
                                label="example"
                                size="xs"
                            >
                                <RadioButtonGroup.Option value="single" label="Single" />
                                <RadioButtonGroup.Option value="multi" label="BNB + CAKE" />
                            </RadioButtonGroup>
                        }
                    >
                        <TradeForm.Input
                            placeholder="0.0"
                            showBalance
                            showRate
                            valueType={
                                <div className="okd--mx-2">
                                    <TokenSelector.Trigger
                                        token={{
                                            src:
                                                'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/btc.png',
                                            name: 'BTC',
                                        }}
                                        onClick={() => {
                                            showTokenSelector();
                                        }}
                                    />
                                    <TokenSelector
                                        visible={isModalVisible}
                                        onClose={() => hideTokenSelector()}
                                        list={[
                                            {
                                                src:
                                                    'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/btc.png',
                                                name: 'BTC',
                                                balance: 123,
                                                rate: '$333',
                                            },
                                            {
                                                src:
                                                    'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/btc.png',
                                                name: 'BTC',
                                                balance: 123,
                                                rate: '$333',
                                            },
                                        ]}
                                    />
                                </div>
                            }
                        />
                        {selectedToken === 'multi' && (
                            <TradeForm.Input
                                placeholder="0.0"
                                showBalance
                                showRate
                                valueType={
                                    <div className="okd--mx-2">
                                        <TokenSelector.Trigger
                                            token={{
                                                src:
                                                    'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/btc.png',
                                                name: 'BTC',
                                            }}
                                            onClick={() => {
                                                showTokenSelector();
                                            }}
                                        />
                                        <TokenSelector
                                            visible={isModalVisible}
                                            onClose={() => hideTokenSelector()}
                                            list={[
                                                {
                                                    src:
                                                        'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/btc.png',
                                                    name: 'BTC',
                                                    balance: 123,
                                                    rate: '$333',
                                                },
                                                {
                                                    src:
                                                        'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/128/color/btc.png',
                                                    name: 'BTC',
                                                    balance: 123,
                                                    rate: '$333',
                                                },
                                            ]}
                                        />
                                    </div>
                                }
                            />
                        )}
                    </TradeForm>
                    <TradeForm label="To">
                        <TradeForm.Input
                            readOnly
                            value="5.4651"
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
                        <TradeForm.Description
                            list={[
                                {
                                    description: 'Est. Pool Allocation',
                                    values: [
                                        {
                                            name: 'cake',
                                            value: '26.26',
                                        },
                                        {
                                            name: 'wbnb',
                                            value: '1.176',
                                        },
                                    ],
                                },
                                {
                                    description: 'Est. Daily Income',
                                    values: '$0.01',
                                },
                            ]}
                        />
                    </TradeForm>
                    <DescriptionList>
                        <DescriptionList.Item itemKey="Minimum Received" itemValue="5.35167" />
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
                        Add Liquidity
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

AddLiquidityModal.defaultProps = defaultProps;

export default AddLiquidityModal;
