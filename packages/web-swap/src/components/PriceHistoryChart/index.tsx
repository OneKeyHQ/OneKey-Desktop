import { FC, useState, useEffect, useMemo, useCallback } from 'react';
import {
    XAxis,
    Tooltip,
    AreaChart,
    Area,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';
import Decimal from 'decimal.js-light';
import { useIntl } from 'react-intl';
import { RadioButtonGroup } from '@onekeyhq/ui-components';
import { Currency } from '@uniswap/sdk-core';

// import PricePairInfo from './PricePairInfo';

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

enum Range {
    DAY,
    WEEK,
    MONTH,
}

// Unit in second
const DAY = 60 * 60 * 24;

const getTimeRange = (selectedRange: Range) => {
    switch (selectedRange) {
        case Range.DAY:
            return DAY;
        case Range.WEEK:
            return 7 * DAY;
        case Range.MONTH:
            return 30 * DAY;
    }
};

const formatChangeRate = (startPrice: number, currentPrice: number, unit?: string) => {
    const change = new Decimal(currentPrice).minus(startPrice);
    const currentIsRisen = change.gt(0);
    const rate = change.eq(0) ? new Decimal(0) : change.div(startPrice).mul(100);
    const sign = currentIsRisen ? '+' : '-';

    const text = unit
        ? `${sign}${change.toSignificantDigits(6).toFixed().replace('-', '')} ${unit} (${sign}${rate
              .toFixed(2)
              .replace('-', '')}%)`
        : `${sign}$${change.toSignificantDigits(6).toFixed().replace('-', '')} (${sign}${rate
              .toFixed(2)
              .replace('-', '')}%)`;

    return { currentIsRisen, text };
};

const THREE_MIN = 1000 * 60 * 3;

const normalizePairData = (input: PriceTuple[], output: PriceTuple[]) => {
    const pairData: PriceTuple[] = [];

    for (const price of input) {
        const [time, inputPrice] = price;
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

export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
}

interface PriceHistoryChartProps {
    currencies: { [field in Field]: Currency };
    isExactIn?: boolean;
    chainId?: number;
}

const PriceHistoryChart: FC<PriceHistoryChartProps> = ({ isExactIn, currencies, chainId }) => {
    const [data, setData] = useState<PriceTuple[]>([]);
    const [hoverValue, setHoverValue] = useState<number>();
    const [chartError, setChartError] = useState<string>();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [range, setRange] = useState(Range.DAY);
    const { formatMessage } = useIntl();

    const handleRangeSelect = useCallback((value: string) => {
        const typedValue = value as 'd' | 'w' | 'm';
        const parsedRange =
            typedValue === 'd' ? Range.DAY : typedValue === 'w' ? Range.WEEK : Range.MONTH;
        setRange(parsedRange);
    }, []);

    // const pastText = useMemo(() => {
    //     switch (range) {
    //         case Range.DAY:
    //             return formatMessage({ id: 'chart__past_day' });
    //         case Range.WEEK:
    //             return formatMessage({ id: 'chart__past_week' });
    //         case Range.MONTH:
    //             return formatMessage({ id: 'chart__past_month' });
    //     }
    // }, [range, formatMessage]);

    // const { currentChange, currentPrice, currentIsRisen } = useMemo(() => {
    //     if (data?.length && !chartError) {
    //         const startPrice = data[0][1];
    //         const currentPrice = data[data.length - 1][1];

    //         const { text: change, currentIsRisen } = formatChangeRate(
    //             hoverValue ? data[data.length - 1][1] : startPrice,
    //             hoverValue ?? currentPrice,
    //             isExactIn ? undefined : currencies[Field.OUTPUT].symbol,
    //         );
    //         return { currentChange: change, currentPrice, currentIsRisen };
    //     }
    //     return { currentChange: 0, currentPrice: 0, currentIsRisen: false };
    // }, [data, chartError, hoverValue, isExactIn, currencies]);

    const getAddrFromCurrency = useCallback<(c: Currency | undefined) => string | undefined>(
        (currency?: Currency) => {
            if (chainId && currency) {
                return currency.isNative
                    ? WRAPPED_NATIVE_COIN_ADDRESS_MAP[currency.chainId]
                    : currency.address;
            }
            return;
        },
        [chainId],
    );

    const { inputTokenAddress, outputTokenAddress } = useMemo(() => {
        const input = currencies[Field.INPUT] || currencies[Field.OUTPUT];
        if (!input) return {};

        const inputTokenAddress = getAddrFromCurrency(input);
        const output = isExactIn ? undefined : currencies[Field.OUTPUT];
        const outputTokenAddress = getAddrFromCurrency(output);

        return {
            inputTokenAddress,
            outputTokenAddress,
        };
    }, [currencies, isExactIn, getAddrFromCurrency]);

    useEffect(() => {
        const noHistoryError = formatMessage({ id: 'chart__error__no_history' });
        if (!chainId || !inputTokenAddress) {
            setChartError(noHistoryError);
            return;
        }

        const updatePriceData = async () => {
            const chainName = COINGECKO_CHAIN_MAP[chainId];
            if (!chainName) {
                return;
            }

            setIsLoadingData(true);
            setChartError(undefined);

            const to = Math.round(Date.now() / 1000);
            const from = to - getTimeRange(range);

            const INPUT_HISTORY_API_URL = `https://api.coingecko.com/api/v3/coins/${chainName}/contract/${inputTokenAddress}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;

            try {
                const { prices: inputPrices } = await fetch(INPUT_HISTORY_API_URL).then(rs =>
                    rs.json(),
                );
                let normalizedPrices = inputPrices;
                if (outputTokenAddress) {
                    const OUTPUT_HISTORY_API_URL = `https://api.coingecko.com/api/v3/coins/${chainName}/contract/${outputTokenAddress}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
                    const { prices: outputPrices } = await fetch(OUTPUT_HISTORY_API_URL).then(rs =>
                        rs.json(),
                    );
                    normalizedPrices = normalizePairData(inputPrices ?? [], outputPrices ?? []);
                }
                if (!normalizedPrices || !normalizedPrices.length) {
                    setData([]);
                    setChartError(noHistoryError);
                    setIsLoadingData(false);
                    return;
                }
                setData(normalizedPrices);
                setIsLoadingData(false);
            } catch (error) {
                console.log('Error on fetching price history', error);
                setChartError(noHistoryError);
                setData([]);
                setIsLoadingData(false);
            }
        };

        updatePriceData();
    }, [chainId, inputTokenAddress, range, formatMessage, outputTokenAddress]);

    const hasRisen = data?.length > 0 && data[data.length - 1][1] - data[0][1] > 0;

    /*
    todo: add this to wrapper
    .recharts-xAxis {
        transform: translate(0, 6%);
    } */

    return (
        <div className="min-h-[300px] w-full p-4 pr-8 flex flex-col text-base">
            <div className="flex items-start justify-between">
                {/* <PricePairInfo
                    change={currentChange}
                    pastText={pastText}
                    price={currentPrice}
                    hoverValue={hoverValue}
                    isRisen={currentIsRisen}
                    isLoading={isLoadingData}
                    error={chartError}
                    currencies={currencies}
                    isExactIn={isExactIn}
                /> */}

                <div className="flex">
                    <RadioButtonGroup value={range.toString()} onChange={handleRangeSelect}>
                        <RadioButtonGroup.Option label="24H" value="d" />
                        <RadioButtonGroup.Option label="1W" value="w" />
                        <RadioButtonGroup.Option label="1M" value="m" />
                    </RadioButtonGroup>
                </div>
            </div>

            <div className="mt-2">
                {chartError ? (
                    chartError
                ) : isLoadingData ? (
                    <div className="rounded-2xl" style={{ height: '392px' }} />
                ) : (
                    <Chart
                        data={data}
                        onMouseMove={(value: number) => {
                            setHoverValue?.(value);
                        }}
                        onMouseLeave={() => {
                            setHoverValue?.(undefined);
                        }}
                        color={hasRisen ? '#00B812' : '#FF3B30'}
                        range={range}
                    />
                )}
            </div>
        </div>
    );
};

type PriceTuple = [number, number];

interface ChartProps {
    data: PriceTuple[];
    onMouseMove: (value: number) => void;
    onMouseLeave: () => void;
    color?: string;
    range: Range;
}

const Chart = ({ data, onMouseMove, onMouseLeave, color = '#00B812', range }: ChartProps) => {
    const renderTooltip = ({
        active,
        label,
        payload,
    }: {
        active?: boolean;
        label?: string;
        payload?: any[];
    }) => {
        if (!active || !payload || !payload?.length) return null;
        const formattedTime = dayjs(label).format('HH:mm YYYY.MM.DD [GMT]Z');
        return (
            <div className="flex flex-row items-start p-3 text-sm font-semibold text-white bg-gray-900 rounded-xl">
                {formattedTime}
            </div>
        );
    };

    const formatXAxisTicks = (time: number) => {
        const timeObject = dayjs(time);

        switch (range) {
            case Range.DAY:
                return timeObject.format('h:mm A');
            default:
                return timeObject.format('MMM DD');
        }
    };

    const formatYAxis = (price: number) => {
        const priceDecimal = new Decimal(price);
        return priceDecimal.gte(10 ** 5)
            ? priceDecimal.toFixed(2)
            : priceDecimal.toSignificantDigits(6).toFixed();
    };

    const tickData = data.filter((_, i) => i % Math.floor(data.length / 3) === 0);
    const startXTicks = tickData.map(([time]) => time);

    const xAxisTicks =
        data.length > 0
            ? startXTicks.length === 4
                ? startXTicks
                : [...startXTicks, data[data.length - 1][0]]
            : [];

    // const yAxisTicks =
    //   data.length > 0 ? (startYTicks.length === 4 ? startYTicks : [...startYTicks, data[data.length - 1][1]]) : []

    const shrinkedData =
        data.length > 360
            ? data.filter(
                  (_, i) => i % Math.round(data.length / 360) === 0 || i === data.length - 1,
              )
            : data;

    const maximalPrice = data?.[0]?.[1] ?? 0;
    const lengthOfMaximalPrice = formatYAxis(maximalPrice).length;
    const xOffset = 4;
    const constOffset = 2;
    const leftMargin = (lengthOfMaximalPrice - xOffset) ** 2 + constOffset;

    return (
        <ResponsiveContainer height="100%" width="100%">
            <AreaChart
                data={shrinkedData}
                margin={{ top: 30, right: 0, bottom: 55, left: leftMargin }}
                onMouseMove={({ activePayload }: { activePayload: { value: number }[] }) => {
                    if (activePayload?.length) {
                        onMouseMove(activePayload[0].value);
                    }
                }}
                onMouseLeave={onMouseLeave}
            >
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.33} />
                        <stop offset="77%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    name="time"
                    dataKey="0"
                    axisLine={false}
                    tickLine={false}
                    ticks={xAxisTicks}
                    tickFormatter={formatXAxisTicks}
                    padding={{ left: 0, right: 0 }}
                />

                {/* Use to extent values to look more steep  */}
                <YAxis
                    type="number"
                    dataKey="1"
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin', 'dataMax']}
                    // domain={[
                    //   (dataMin: number) => (dataMin >= 10 ? dataMin + 10 - (dataMin % 10) : dataMin),
                    //   (dataMax: number) => (dataMax >= 10 ? dataMax - (dataMax % 10) : dataMax)
                    // ]}
                    tickFormatter={formatYAxis}
                />
                <CartesianGrid vertical={false} stroke="#aaa" strokeDasharray="5 5" />
                <Tooltip content={renderTooltip} />
                <Area
                    name="price"
                    dataKey="1"
                    type="basis"
                    stroke={color}
                    fill="url(#gradient)"
                    strokeWidth={2}
                    baseValue={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default PriceHistoryChart;
