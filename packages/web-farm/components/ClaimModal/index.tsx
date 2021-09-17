import React, { FC } from 'react';
import cx, { Argument } from 'classnames';
import { Modal, Button, TradeForm, Token } from '@onekeyhq/ui-components';
import { TransactionSettings, DescriptionList } from '../index';

type ClaimModalProps = {
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

const ClaimModal: FC<ClaimModalProps> = ({ className, visible, onClose, ...rest }) => {
    return (
        <>
            <Modal
                visible={visible}
                onClose={onClose}
                className={cx('sm:!max-w-md', !!className && className)}
                {...rest}
            >
                <Modal.Header
                    title="Claim"
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
                        <TradeForm>
                            <TradeForm.Input
                                value="5.4651"
                                showRate
                                showBalance
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
                    <div className="flex">
                        <Button className="flex-1" type="primary">
                            Claim
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

ClaimModal.defaultProps = defaultProps;

export default ClaimModal;
