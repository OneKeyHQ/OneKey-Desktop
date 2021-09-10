import TrezorConnect, { FeeLevel, SignTransaction } from '@onekeyhq/connect';
import BigNumber from 'bignumber.js';
import { clone } from 'lodash';
import * as notificationActions from '@suite-actions/notificationActions';
import { formatNetworkAmount } from '@wallet-utils/accountUtils';
import { getBitcoinComposeOutputs } from '@wallet-utils/sendFormUtils';
import {
    ZEC_SIGN_ENHANCEMENT,
    ZEC_SIGN_ENHANCEMENT_HEARTWOOD,
    BTC_RBF_SEQUENCE,
    BTC_LOCKTIME_SEQUENCE,
} from '@wallet-constants/sendForm';
import {
    FormState,
    UseSendFormState,
    PrecomposedLevels,
    PrecomposedTransaction,
    PrecomposedTransactionFinal,
} from '@wallet-types/sendForm';
import { Dispatch, GetState } from '@suite-types';

/* eslint-disable no-bitwise, no-restricted-globals */

export const HD_HARDENED = 0x80000000;
export const toHardened = (n: number): number => (n | HD_HARDENED) >>> 0;
export const fromHardened = (n: number): number => (n & ~HD_HARDENED) >>> 0;

export const getHDPath = (path: string): Array<number> => {
    const parts: Array<string> = path.toLowerCase().split('/');
    if (parts[0] !== 'm') throw new Error('Method_InvalidParameter');
    return parts
        .filter((p: string) => p !== 'm' && p !== '')
        .map((p: string) => {
            let hardened = false;
            if (p.substr(p.length - 1) === "'") {
                hardened = true;
                p = p.substr(0, p.length - 1);
            }
            let n: number = parseInt(p, 10);
            if (isNaN(n)) {
                throw new Error('Method_InvalidParameter');
            } else if (n < 0) {
                throw new Error('Method_InvalidParameter');
            }
            if (hardened) {
                // hardened index
                n = toHardened(n);
            }
            return n;
        });
};

/* eslint-enable no-bitwise, no-restricted-globals */

export const composeTransaction = (formValues: FormState, formState: UseSendFormState) => async (
    dispatch: Dispatch,
    getState: GetState,
) => {
    const { account, feeInfo } = formState;
    const { useChangeAddress } = getState().wallet.settings;

    if (!account.addresses || !account.utxo) return;

    const composeOutputs = getBitcoinComposeOutputs(formValues, account.symbol);
    if (composeOutputs.length < 1) return;

    // clone FeeLevels in rbf, the will be modified later
    const levels = formValues.rbfParams ? feeInfo.levels.map(l => ({ ...l })) : feeInfo.levels;
    const predefinedLevels = levels.filter(l => l.label !== 'custom');
    // in case when selectedFee is set to 'custom' construct this FeeLevel from values
    if (formValues.selectedFee === 'custom') {
        predefinedLevels.push({
            label: 'custom',
            feePerUnit: formValues.feePerUnit,
            blocks: -1,
        });
    }

    // FeeLevels in rbf form are increased by original/prev rate
    // decrease it since the calculation (in connect) is based on the baseFee not the prev rate
    const origRate = formValues.rbfParams ? parseInt(formValues.rbfParams.feeRate, 10) : undefined;
    if (origRate) {
        predefinedLevels.forEach(l => {
            l.feePerUnit = Number(parseInt(l.feePerUnit, 10) - origRate).toString();
        });
    }

    const baseFee = formValues.rbfParams ? formValues.rbfParams.baseFee : 0;
    const params = {
        account: {
            path: account.path,
            addresses: account.addresses,
            // it is technically possible to have utxo with amount '0' see: https://tbtc1.trezor.io/tx/352873fe6cd5a83ca4b02737848d7d839aab864b8223c5ba7150ae35c22f4e38
            // however they should be excluded to avoid increase fee
            // TODO: this should be fixed in TrezorConnect + hd-wallet.composeTx? (connect throws: 'Segwit output without amount' error)
            utxo: formState.utxo || account.utxo.filter(input => input.amount !== '0'),
        },
        feeLevels: predefinedLevels,
        baseFee,
        outputs: composeOutputs,
        coin: account.symbol,
    };

    const response = await TrezorConnect.composeTransaction({
        ...params,
        account: params.account, // needs to be present in order to correct resolve of @onekeyhq/connect params overload
    });

    if (!response.success) {
        dispatch(
            notificationActions.addToast({
                type: 'sign-tx-error',
                error: response.payload.error,
            }),
        );
        return;
    }
    const isSendMax = composeOutputs.find(e => e.type === 'send-max') !== undefined;
    const composeOutputsRecords = (composeOutputs as any[]).reduce((result, item) => {
        result[item.address] = true;
        return result;
    }, {});
    if (!useChangeAddress && !isSendMax) {
        const { used, unused } = account.addresses;
        const current = used[0] ?? unused[0];
        const { path } = current;
        const hdPath = getHDPath(path);
        response.payload.forEach((item: any) => {
            const changeItems = (item.transaction.outputs as any[]).filter(
                output => !composeOutputsRecords[output.address],
            );
            if (changeItems.length === 1) {
                (changeItems as any[])[0].address_n = hdPath;
            }
        });
    }

    // wrap response into PrecomposedLevels object where key is a FeeLevel label
    const wrappedResponse: PrecomposedLevels = {};
    response.payload.forEach((tx, index) => {
        const feeLabel = predefinedLevels[index].label as FeeLevel['label'];
        wrappedResponse[feeLabel] = tx as PrecomposedTransaction;
    });

    const hasAtLeastOneValid = response.payload.find(r => r.type !== 'error');
    // there is no valid tx in predefinedLevels and there is no custom level
    if (!hasAtLeastOneValid && !wrappedResponse.custom) {
        const { minFee } = feeInfo;
        const lastKnownFee = predefinedLevels[predefinedLevels.length - 1].feePerUnit;
        // define coefficient for maxFee
        // NOTE: DOGE has very large values of FeeLevels, up to several thousands sat/B, rangeGap should be greater in this case otherwise calculation takes too long
        // TODO: calculate rangeGap more precisely (percentage of range?)
        const range = new BigNumber(lastKnownFee).minus(minFee);
        const rangeGap = range.gt(1000) ? 1000 : 1;
        let maxFee = new BigNumber(lastKnownFee).minus(rangeGap);
        // generate custom levels in range from lastKnownFee minus customGap to feeInfo.minFee (coinInfo in @onekeyhq/connect)
        const customLevels: FeeLevel[] = [];
        while (maxFee.gte(minFee)) {
            customLevels.push({ feePerUnit: maxFee.toString(), label: 'custom', blocks: -1 });
            maxFee = maxFee.minus(rangeGap);
        }

        // check if any custom level is possible
        const customLevelsResponse =
            customLevels.length > 0
                ? await TrezorConnect.composeTransaction({
                      ...params,
                      account: params.account, // needs to be present in order to correct resolve type of @onekeyhq/connect params overload
                      feeLevels: customLevels,
                  })
                : ({ success: false } as const);

        if (customLevelsResponse.success) {
            const customValid = customLevelsResponse.payload.findIndex(r => r.type !== 'error');
            if (customValid >= 0) {
                wrappedResponse.custom = customLevelsResponse.payload[
                    customValid
                ] as PrecomposedTransaction;
            }
        }
    }

    // format max (@onekeyhq/connect sends it as satoshi)
    // format errorMessage and catch unexpected error (other than AMOUNT_IS_NOT_ENOUGH)
    Object.keys(wrappedResponse).forEach(key => {
        const tx = wrappedResponse[key];
        if (tx.type !== 'error') {
            if (formValues.selectedFee === 'custom') {
                // calculated/real feeePerByte may be slightly higher that requested
                // example: spending dust limit, chained txs in rbf...
                // override calculated value
                tx.feePerByte = formValues.feePerUnit;
            } else {
                // make sure that feePerByte is an integer (@onekeyhq/connect may return float)
                tx.feePerByte = new BigNumber(tx.feePerByte)
                    .integerValue(BigNumber.ROUND_FLOOR)
                    .toString();
            }
            if (typeof tx.max === 'string') {
                tx.max = formatNetworkAmount(tx.max, account.symbol);
            }
        } else if (tx.error === 'NOT-ENOUGH-FUNDS') {
            tx.errorMessage = { id: 'AMOUNT_IS_NOT_ENOUGH' };
        } else {
            // catch unexpected error
            dispatch(
                notificationActions.addToast({
                    type: 'sign-tx-error',
                    error: tx.error,
                }),
            );
        }
    });

    return wrappedResponse;
};

export const signTransaction = (
    formValues: FormState,
    transactionInfo: PrecomposedTransactionFinal,
) => async (dispatch: Dispatch, getState: GetState) => {
    const { selectedAccount, blockchain } = getState().wallet;
    const { device } = getState().suite;
    if (
        selectedAccount.status !== 'loaded' ||
        !device ||
        !transactionInfo ||
        transactionInfo.type !== 'final'
    )
        return;

    // transactionInfo needs some additional changes:
    const { account } = selectedAccount;
    const { transaction } = transactionInfo;

    let sequence: number | undefined;
    let signEnhancement: Partial<SignTransaction> = {};

    // enhance signTransaction params for zcash (version_group_id etc.)
    if (account.symbol === 'zec') {
        // TEMP: remove this after fork
        if (blockchain.zec.blockHeight >= 1046400) {
            signEnhancement = ZEC_SIGN_ENHANCEMENT;
        } else {
            signEnhancement = ZEC_SIGN_ENHANCEMENT_HEARTWOOD;
        }
        // signEnhancement = ZEC_SIGN_ENHANCEMENT;
    }

    if (formValues.options.includes('bitcoinRBF')) {
        // RBF is set, add sequence to inputs
        sequence = BTC_RBF_SEQUENCE;
    } else if (formValues.bitcoinLockTime) {
        // locktime is set, add sequence to inputs and add enhancement params
        sequence = BTC_LOCKTIME_SEQUENCE;
        signEnhancement.locktime = new BigNumber(formValues.bitcoinLockTime).toNumber();
    }

    // update inputs
    // TODO: 0 amounts should be excluded together with "exclude dustLimit" feature and "utxo picker" feature in composeTransaction (above)
    const prevTxid = formValues.rbfParams ? formValues.rbfParams.txid : undefined;
    const inputs = transaction.inputs
        .map((input, index) => ({
            ...input,
            sequence,
            orig_index: prevTxid ? index : undefined,
            orig_hash: prevTxid,
        }))
        .filter(input => input.amount !== '0'); // remove '0' amounts
    inputs.forEach(input => {
        if (!input.sequence) delete input.sequence; // remove undefined sequence
    });

    let { outputs } = transaction;

    // outputs may be sorted in different order (see hd-wallet buildTx permutations)
    // restore original tx order before signing replacement transaction
    if (formValues.rbfParams) {
        const origOutputs = formValues.rbfParams.outputs;
        outputs = origOutputs.flatMap((prevOutput, index) => {
            const output =
                prevOutput.type === 'change'
                    ? outputs.find(o => o.address_n)
                    : outputs.find(
                          o => o.address === prevOutput.address && o.amount === prevOutput.amount,
                      );
            if (!output) return []; // it's possible. example: new tx without change output
            return [
                {
                    ...output,
                    orig_index: index,
                    orig_hash: prevTxid,
                },
            ];
        });
    }

    const signPayload = {
        device: {
            path: device.path,
            instance: device.instance,
            state: device.state,
        },
        useEmptyPassphrase: device.useEmptyPassphrase,
        inputs,
        outputs,
        account: {
            addresses: account.addresses!,
        },
        coin: account.symbol,
        ...signEnhancement,
    };

    const signedTx = await TrezorConnect.signTransaction(signPayload);

    if (!signedTx.success) {
        // catch manual error from ReviewTransaction modal
        if (signedTx.payload.error === 'tx-cancelled') return;
        dispatch(
            notificationActions.addToast({
                type: 'sign-tx-error',
                error: signedTx.payload.error,
            }),
        );
        return;
    }

    return signedTx.payload.serializedTx;
};
