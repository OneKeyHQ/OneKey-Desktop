import { FC, ReactNode } from 'react';
import cx from 'classnames';

import { RangeString } from './RangeSelector';
import Chart from './Chart';
import CustomResponsiveContainer from './CustomResponsiveContainer';

export type PriceTuple = [number, number];
interface PriceHistoryChartProps {
    range: RangeString;
    topLeft?: ReactNode;
    topRight?: ReactNode;
    data?: PriceTuple[];
    chartColor?: string;
    className?: string;
    onMouseMove?: (value: number) => void;
    onMouseLeave?: () => void;
}

const PriceHistoryChart: FC<PriceHistoryChartProps> = ({
    data,
    chartColor,
    topLeft,
    topRight,
    range,
    className,
    onMouseMove,
    onMouseLeave,
}) => {
    const chartNode = !!data?.length && (
        <CustomResponsiveContainer height="100%" width="100%">
            <Chart
                data={data}
                range={range}
                color={chartColor}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
            />
        </CustomResponsiveContainer>
    );

    return (
        <div className={cx('w-full p-4 pr-8 flex flex-col', className)}>
            <div className="flex items-start justify-between">
                {topLeft}
                {topRight}
            </div>

            <div className="mt-2 flex-1">{chartNode}</div>
        </div>
    );
};

export default PriceHistoryChart;
