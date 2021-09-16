import React, { FC } from 'react';
import cx, { Argument } from 'classnames';
import {
    Modal,
    Button,
    TradeForm,
    RadioButtonGroup,
    TokenGroup,
    Token,
} from '@onekeyhq/ui-components';
import { TransactionSettings, DescriptionList } from '../index';

type UnstakeModalProps = {
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

const UnstakeModal: FC<UnstakeModalProps> = ({ className, visible, onClose, ...rest }) => {
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
                    title="Unstake"
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
                                <RadioButtonGroup
                                    value={selectedPercentage}
                                    onChange={setSelectedPercentage}
                                    label="example"
                                    size="xs"
                                    className="flex-1"
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
                                        value="max"
                                        label="100%"
                                    />
                                </RadioButtonGroup>
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
                            ></TradeForm.Input>
                        </TradeForm>
                        <TradeForm label="Estimated Reward">
                            <TradeForm.Input
                                readOnly
                                value="5.4651"
                                showRate
                                valueType={
                                    <div className="okd-flex okd-items-center">
                                        <Token chain="bsc" name="BSC" />
                                    </div>
                                }
                            />
                        </TradeForm>
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
                            Unstake
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

UnstakeModal.defaultProps = defaultProps;

export default UnstakeModal;
