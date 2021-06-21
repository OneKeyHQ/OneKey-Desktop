import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Translation } from '@suite-components';
import { UserContextPayload } from '@suite-actions/modalActions';
import { fromWei, hexToNumber, hexToNumberString, numberToHex, toBN, toWei } from 'web3-utils';
import styled from 'styled-components';
import { Button, Input, Modal } from '@trezor/components';
import Web3 from 'web3';

const TransactionFee = styled.div`
    font-size: 0.75rem;
    line-height: 140%;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    color: ${props => props.theme.BG_LIGHT_GREY};
`;

const TransactionFeeNum = styled.div`
    font-size: 1rem;
    line-height: 140%;
    margin-top: 0;
`;

const InputWrapper = styled.div`
    position: relative;
    border: ${props => props.theme.TYPE_DARK_GREY};
    font-size: 1rem;
    margin-top: 8px;
    padding: 8px 8px;
    height: 265px;
    border-bottom: 1px solid ${props => props.theme.TYPE_LIGHTER_GREY};
    border-top: 1px solid ${props => props.theme.TYPE_LIGHTER_GREY};
    gap: 0.5rem;
`;

const InputRow = styled.div`
    display: flex;
    flex-direction: column;
    text-align: start;
`;

const PreviewWrapper = styled.div`
    font-size: 0.75rem;
    line-height: 140%;
    background: ${props => props.theme.BG_LIGHT_GREY};
    padding: 15px 0;
    display: flex;
    flex-flow: column;
    color: ${props => props.theme.TYPE_DARK_GREY};
`;

const PreviewRow = styled.div`
    display: flex;
    flex-flow: row;
    justify-content: space-between;
`;

const ButtonWrapper = styled.div`
    display: grid;
    place-items: center;
`;

const PreDefinedPriceButton = styled(Button)`
    display: flex;
    flex-direction: column;
    margin: 8px auto;
`;

const ToggleCustomPriceButton = styled(Button)`
    position: absolute;
    bottom: 0;
    right: 0;
`;

interface GasNowData {
    code: number;
    data: {
        rapid: number;
        fast: number;
        standard: number;
        slow: number;
        timestamp: number;
    };
}

type GasNowTypes = 'standard' | 'fast' | 'rapid';

interface Props extends Extract<UserContextPayload, { type: 'change-gas' }> {
    onCancel: () => void;
}

// wrapper for shareable Fees component
const ChangeGas = (props: Props) => {
    const web3 = new Web3(props.transaction.rpcUrl);
    const [isCustomPrice, toggleCustomPrice] = useReducer(a => !a, false);
    const [gasNowData, setGasNowData] = useState<GasNowData>();
    const [gasPrice, setGasPrice] = useState(
        props.transaction.gasPrice
            ? fromWei(hexToNumberString(props.transaction.gasPrice), 'Gwei')
            : '',
    );
    const [customGasLimit, setCustomGasLimit] = useState(
        hexToNumberString(props.transaction.gasLimit),
    );

    // gas now page doesn't show the actually gasLimit number, so no need to rerender, no need to use state.
    const gasLimitRef = useRef(21000);
    const [selectedType, setSelectedType] = useState<GasNowTypes>();

    useEffect(() => {
        fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=onekey')
            .then(response => response.json())
            .then(data => setGasNowData(data));
    }, []);

    useEffect(() => {
        const getGasLimit = async () => {
            const resp = await web3.eth.getCode(props.transaction.to);
            if (hexToNumberString(resp) === '0') {
                gasLimitRef.current = 21000;
            } else {
                const { chainId, gasLimit, rpcUrl, ...rest } = props.transaction;
                const estimateGas = await web3.eth.estimateGas({
                    ...rest,
                    nonce: hexToNumber(rest.nonce),
                });
                gasLimitRef.current = Math.round(estimateGas * 1.2);
            }
        };
        getGasLimit();
    }, [props.transaction, web3.eth]);

    useEffect(() => {
        if (!props.transaction.gasPrice) {
            web3.eth.getGasPrice().then(defaultGasPrice => {
                setGasPrice(fromWei(defaultGasPrice, 'Gwei'));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.transaction.gasPrice]);

    const setGasPriceWithGasNowData = (price?: number) => {
        if (!price) return;
        props.decision.resolve({
            ...props.transaction,
            gasPrice: numberToHex(price),
            gasLimit: numberToHex(gasLimitRef.current),
        });
        props.onCancel();
    };

    const save = () => {
        if (!isCustomPrice && selectedType) {
            return setGasPriceWithGasNowData(gasNowData?.data[selectedType]);
        }
        if (isCustomPrice && customGasLimit && gasPrice) {
            props.decision.resolve({
                ...props.transaction,
                gasPrice: numberToHex(toWei(gasPrice, 'Gwei')),
                gasLimit: numberToHex(customGasLimit),
            });
            props.onCancel();
        }
    };
    const cancel = () => {
        props.decision.reject(Error('user canceled'));
        props.onCancel();
    };

    const getFeeETHFromGasPriceInput = () => {
        try {
            return fromWei(
                String(parseFloat(toWei(gasPrice, 'Gwei')) * parseFloat(customGasLimit)),
            );
        } catch {
            return '0';
        }
    };
    const getValueETH = () => {
        try {
            return fromWei(hexToNumberString(props.transaction.value!));
        } catch {
            return '0';
        }
    };

    const getFeeETH = (price?: number) => {
        if (!price) return '0';
        try {
            return fromWei(String(price * parseFloat(customGasLimit)));
        } catch {
            return '0';
        }
    };
    return (
        <Modal
            cancelable
            onCancel={cancel}
            heading={<Translation id="FEE" />}
            useFixedWidth
            fixedWidth={['360px', '360px', '360px', '360px']}
        >
            <div>
                <TransactionFee>
                    <Translation id="TR_BUMP_FEE" />
                </TransactionFee>
                <TransactionFeeNum>{getFeeETHFromGasPriceInput()}</TransactionFeeNum>
            </div>
            {!isCustomPrice && (
                <InputWrapper>
                    {(['standard', 'fast', 'rapid'] as Array<GasNowTypes>).map(type => (
                        <PreDefinedPriceButton
                            variant={type === selectedType ? 'primary' : 'secondary'}
                            onClick={() => setSelectedType(type)}
                        >
                            <Translation id={`TR_GAS_PRICE_TYPE_${type.toUpperCase()}` as any} />
                            <div>{getFeeETH(gasNowData?.data[type])}</div>
                        </PreDefinedPriceButton>
                    ))}
                    <ToggleCustomPriceButton variant="tertiary" onClick={toggleCustomPrice}>
                        <Translation id="TR_GAS_PRICE_CUSTOM" />
                    </ToggleCustomPriceButton>
                </InputWrapper>
            )}
            {isCustomPrice && (
                <InputWrapper>
                    <InputRow>
                        <Input
                            label={
                                <div>
                                    <Translation id="TR_GAS_PRICE" /> (GWEI)
                                </div>
                            }
                            value={gasPrice}
                            onChange={e => setGasPrice(e.target.value)}
                        />
                    </InputRow>
                    <InputRow>
                        <Input
                            label={<Translation id="TR_GAS_LIMIT" />}
                            value={customGasLimit}
                            onChange={e => setCustomGasLimit(e.target.value)}
                        />
                    </InputRow>
                    <ToggleCustomPriceButton variant="tertiary" onClick={toggleCustomPrice}>
                        <Translation id="TR_GAS_PRICE_DEFAULT" />
                    </ToggleCustomPriceButton>
                </InputWrapper>
            )}
            <PreviewWrapper>
                <PreviewRow>
                    <div>
                        <Translation id="AMOUNT" />
                    </div>
                    <div>{getValueETH()}</div>
                </PreviewRow>
                <PreviewRow>
                    <div>
                        <Translation id="TR_BUMP_FEE" />
                    </div>
                    <div>{getFeeETHFromGasPriceInput()}</div>
                </PreviewRow>
                <PreviewRow>
                    <div>
                        <Translation id="AMOUNT" />(<Translation id="INCLUDING_FEE" />)
                    </div>
                    <div>
                        {parseFloat(getFeeETHFromGasPriceInput()) + parseFloat(getValueETH())}
                    </div>
                </PreviewRow>
            </PreviewWrapper>
            <ButtonWrapper>
                <Button variant="primary" onClick={save}>
                    <Translation id="SAVE" />
                </Button>
            </ButtonWrapper>
        </Modal>
    );
};

export default ChangeGas;
