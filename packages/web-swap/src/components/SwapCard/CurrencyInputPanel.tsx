import { FC, ReactNode } from 'react';
import { Input } from '@onekeyhq/ui-components';
import CurrencySelect, { Token } from './CurrencySelect';

export interface CurrencyInputPanelProps {
    label?: ReactNode;
    tokens: Token[];
    onTokenSelect: (token: Token) => void;
    onUserInput: (value: string) => void;
}

const CurrencyInputPanel: FC<CurrencyInputPanelProps> = ({
    label,
    tokens,
    onTokenSelect,
    onUserInput,
}) => {
    return (
        <div className="flex justify-center items-end space-x-2">
            <div className="flex-1 space-y-1">
                <div className="flex justify-between">{label}</div>
                <Input onChange={onUserInput} className="flex-1" />
            </div>
            <CurrencySelect onSelectToken={onTokenSelect} tokens={tokens} />
        </div>
    );
};

export default CurrencyInputPanel;
