import { useState, useEffect } from 'react';
import { useIntl } from '@onekeyhq/ui-components/Intl';

import { PriceTuple } from '../../components/PriceHistoryChart/ChartWrapper';
import { RangeString } from '../../components/PriceHistoryChart/RangeSelector';
import { Currencies, Field } from '../../pages/App';

const COINGECKO_CHAIN_MAP: Record<number, string> = {
    1: 'ethereum',
    56: 'binance-smart-chain',
    128: 'huobi-token',
    137: 'polygon-pos',
};

const WRAPPED_NATIVE_COIN_ADDRESS_MAP: Record<number, string> = {
    // Wrapped ETH
    1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    // Wrapped BNB
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    // Wrapped HT
    128: '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f',
    // Wrapped Matic Token Address
    137: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
};

const THREE_MIN = 1000 * 60 * 3;
const DAY = 60 * 60 * 24;

const normalizePairData = (input: PriceTuple[], output: PriceTuple[]) => {
    const pairData: PriceTuple[] = [];

    for (const timePricePair of input) {
        const [time, inputPrice] = timePricePair;
        const aroundTimeData = output.find(
            ([outputTime]) => Math.abs(time - outputTime) < THREE_MIN,
        );
        if (aroundTimeData) {
            const [, outputPrice] = aroundTimeData;
            pairData.push([time, inputPrice / outputPrice]);
        }
    }

    return pairData;
};

const getTimeRange = (selectedRange: RangeString) => {
    switch (selectedRange) {
        case 'd':
            return DAY;
        case 'w':
            return 7 * DAY;
        case 'm':
            return 30 * DAY;
    }
};

export const usePairData = (
    { [Field.INPUT]: inputTokenAddress, [Field.OUTPUT]: outputTokenAddress }: Currencies,
    chainId = 1,
    range = 'd',
) => {
    const [error, setError] = useState<string>();
    const [data, setData] = useState<PriceTuple[]>();
    const [isLoading, setIsLoading] = useState(false);
    const { formatMessage } = useIntl();

    useEffect(() => {
        const noHistoryError = formatMessage({ id: 'chart__error__no_history' });
        if (!chainId || !inputTokenAddress) {
            setError(noHistoryError);
            return;
        }

        const updatePriceData = async () => {
            const chainName = COINGECKO_CHAIN_MAP[chainId];
            if (!chainName) {
                return;
            }

            setIsLoading(true);
            setError(undefined);

            const to = Math.round(Date.now() / 1000);
            const from = to - getTimeRange(range as RangeString);

            const normalizedInputTokenAddress =
                inputTokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                    ? WRAPPED_NATIVE_COIN_ADDRESS_MAP[chainId]
                    : inputTokenAddress.toLowerCase();

            const normalizedOutputTokenAddress =
                outputTokenAddress?.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                    ? WRAPPED_NATIVE_COIN_ADDRESS_MAP[chainId]
                    : outputTokenAddress?.toLowerCase();

            const INPUT_HISTORY_API_URL = `https://api.coingecko.com/api/v3/coins/${chainName}/contract/${normalizedInputTokenAddress}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;

            try {
                const { prices: inputPrices } = await fetch(INPUT_HISTORY_API_URL).then(rs =>
                    rs.json(),
                );

                let normalizedPrices = inputPrices;
                if (normalizedOutputTokenAddress) {
                    const OUTPUT_HISTORY_API_URL = `https://api.coingecko.com/api/v3/coins/${chainName}/contract/${normalizedOutputTokenAddress}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
                    const { prices: outputPrices } = await fetch(OUTPUT_HISTORY_API_URL).then(rs =>
                        rs.json(),
                    );
                    normalizedPrices = normalizePairData(inputPrices ?? [], outputPrices ?? []);
                }

                if (!normalizedPrices || !normalizedPrices.length) {
                    setData([]);
                    setError(noHistoryError);
                    setIsLoading(false);
                    return;
                }
                setData(normalizedPrices);
                setIsLoading(false);
            } catch (error) {
                console.log('Error on fetching price history', error);
                setError(noHistoryError);
                setData([]);
                setIsLoading(false);
            }
        };

        updatePriceData();
    }, [chainId, formatMessage, inputTokenAddress, outputTokenAddress, range]);

    return { isLoading, data, error };
};
