import { FC } from 'react';
import { RadioButtonGroup } from '@onekeyhq/ui-components';

export type RangeString = 'd' | 'w' | 'm';

export interface RangeSelectorProps {
    range: RangeString;
    onRangeSelect: (range: string) => void;
}

const RangeSelector: FC<RangeSelectorProps> = ({ range, onRangeSelect }) => {
    return (
        <RadioButtonGroup value={range} onChange={onRangeSelect}>
            <RadioButtonGroup.Option label="24H" value="d" />
            <RadioButtonGroup.Option label="1W" value="w" />
            <RadioButtonGroup.Option label="1M" value="m" />
        </RadioButtonGroup>
    );
};

export default RangeSelector;
