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
    className?: string;
}

const PriceHistoryChart: FC<PriceHistoryChartProps> = ({
    data,
    topLeft,
    topRight,
    range,
    className,
}) => {
    const chartNode = !!data?.length && (
        <CustomResponsiveContainer height="100%" width="100%">
            <Chart data={data} range={range} />
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
