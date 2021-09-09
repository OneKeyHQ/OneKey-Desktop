import { useMemo, useCallback } from 'react';
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
import BigNumber from 'bignumber.js';

import { PriceTuple } from './ChartWrapper';
import { RangeString } from './RangeSelector';

interface ChartProps {
    data: PriceTuple[];
    range: RangeString;
    color?: string;
    onMouseMove?: (value: number) => void;
    onMouseLeave?: () => void;
}

const Chart = ({ data, onMouseMove, onMouseLeave, color = '#00B812', range }: ChartProps) => {
    const renderTooltip = useCallback(
        ({ active, label, payload }: { active?: boolean; label?: string; payload?: any[] }) => {
            if (!active || !payload || !payload?.length) return null;
            const formattedTime = dayjs(label).format('HH:mm YYYY.MM.DD [GMT]Z');
            return (
                <div className="flex flex-row items-start p-3 text-sm font-semibold text-white bg-gray-900 rounded-xl">
                    {formattedTime}
                </div>
            );
        },
        [],
    );

    const formatXAxisTicks = useCallback(
        (time: number) => {
            const timeObject = dayjs(time);

            switch (range) {
                case 'd':
                    return timeObject.format('h:mm A');
                default:
                    return timeObject.format('MMM DD');
            }
        },
        [range],
    );

    const formatYAxis = useCallback((price: number) => {
        const priceDecimal = new BigNumber(price);
        return priceDecimal.gte(10 ** 5) ? priceDecimal.toFixed(2) : priceDecimal.toPrecision(6);
    }, []);

    const tickData = useMemo(
        () => data.filter((_, i) => i % Math.floor(data.length / 3) === 0),
        [data],
    );
    const startXTicks = useMemo(() => tickData.map(([time]) => time), [tickData]);

    const xAxisTicks = useMemo(
        () =>
            data.length > 0
                ? startXTicks.length === 4
                    ? startXTicks
                    : [...startXTicks, data[data.length - 1][0]]
                : [],
        [data, startXTicks],
    );

    const shrinkedData = useMemo(
        () =>
            data.length > 360
                ? data.filter(
                      (_, i) => i % Math.round(data.length / 360) === 0 || i === data.length - 1,
                  )
                : data,
        [data],
    );

    const maximalPrice = useMemo(() => data?.[0]?.[1] ?? 0, [data]);
    const lengthOfMaximalPrice = useMemo(
        () => formatYAxis(maximalPrice).length,
        [formatYAxis, maximalPrice],
    );
    const xOffset = 4;
    const constOffset = 2;
    const leftMargin = useMemo(
        () => (lengthOfMaximalPrice - xOffset) ** 2.055 + constOffset,
        [lengthOfMaximalPrice],
    );

    return (
        <ResponsiveContainer height="100%" width="100%">
            <AreaChart
                data={shrinkedData}
                margin={{ top: 30, right: 0, bottom: 0, left: leftMargin }}
                onMouseMove={({ activePayload }: { activePayload: { value: number }[] }) => {
                    if (activePayload?.length) {
                        onMouseMove?.(activePayload[0].value);
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

export default Chart;
