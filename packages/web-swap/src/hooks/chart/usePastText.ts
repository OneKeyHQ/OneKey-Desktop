import { useIntl } from '@onekeyhq/ui-components/Intl';
import { RangeString } from '../../components/PriceHistoryChart/RangeSelector';

export const usePastText = (range: RangeString, userHoverX?: number) => {
    const { formatMessage } = useIntl();

    if (userHoverX) return '';

    return range === 'd'
        ? formatMessage({ id: 'chart__past_day' })
        : range === 'w'
        ? formatMessage({ id: 'chart__past_week' })
        : formatMessage({ id: 'chart__past_month' });
};
