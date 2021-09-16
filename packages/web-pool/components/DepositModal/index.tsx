import React, { FC } from 'react';
import cx, { Argument } from 'classnames';
import { Modal, Button, TradeForm, TokenGroup, Token } from '@onekeyhq/ui-components';
import { TransactionSettings, DescriptionList } from '../index';

type DepositModalProps = {
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

const DepositModal: FC<DepositModalProps> = ({ className, visible, onClose, ...rest }) => {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            className={cx('sm:!max-w-md', !!className && className)}
            {...rest}
        >
            <Modal.Header
                title="Deposit"
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
                    <TradeForm label="From">
                        <TradeForm.Input
                            placeholder="0.0"
                            showBalance
                            showRate
                            valueType={
                                <div className="okd-flex okd-items-center">
                                    <Token chain="bsc" name="BSC" />
                                </div>
                            }
                        />
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
                                        sources={[{ chain: 'bsc', name: 'BSC' }]}
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
                        Deposit
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

DepositModal.defaultProps = defaultProps;

export default DepositModal;
