import BigNumber from 'bignumber.js';
import { PriceTuple } from '../../components/PriceHistoryChart/ChartWrapper';

const formatChangeRate = (startPrice: number, currentPrice: number, unit?: string) => {
    const change = new BigNumber(currentPrice).minus(startPrice);
    const currentIsRisen = change.gt(0);
    const rate = change.eq(0) ? new BigNumber(0) : change.div(startPrice).multipliedBy(100);
    const sign = currentIsRisen ? '+' : '-';

    const text = unit
        ? `${sign}${change.toFixed(6).replace('-', '')} ${unit} (${sign}${rate
              .toFixed(2)
              .replace('-', '')}%)`
        : `${sign}$${change.toFixed(6).replace('-', '')} (${sign}${rate
              .toFixed(2)
              .replace('-', '')}%)`;

    return { currentIsRisen, text };
};

export const useCurrentChange = (data?: PriceTuple[], hoverPrice?: number) => {
    if (!data) return { currentIsRisen: false, currentChange: '-' };
    const { text: currentChange, currentIsRisen } = formatChangeRate(
        data[0][1],
        hoverPrice ?? data[data.length - 1][1],
    );
    return { currentChange, currentIsRisen };
};
