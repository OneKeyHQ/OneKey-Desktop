import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Dropdown } from '@onekeyhq/ui-components';
import { useIntl } from '@onekeyhq/ui-components/Intl';

export interface Token {
    symbol: string;
    address: string;
}

export interface CurrencySelectProps {
    tokens: Token[];
    onSelectToken: (token: Token) => void;
}

const CurrencySelect: FC<CurrencySelectProps> = ({ tokens, onSelectToken }) => {
    const { formatMessage } = useIntl();

    const [selectedTokenMsg, setSelectedTokenMsg] = useState(formatMessage({ id: 'selectToken' }));

    const handleCurrencySelect = useCallback(
        (token: Token) => {
            setSelectedTokenMsg(token.symbol);
            onSelectToken?.(token);
        },
        [onSelectToken],
    );

    const dropdownItems = useMemo(() => {
        return tokens.map(token => ({
            content: token.symbol,
            onAction: () => handleCurrencySelect(token),
        }));
    }, [handleCurrencySelect, tokens]);

    return (
        <Dropdown
            place="bottom-center"
            sections={[{ items: dropdownItems }]}
            trigger={
                <Button type="plain" trailingIcon="ChevronDownSolid">
                    {selectedTokenMsg}
                </Button>
            }
        />
    );
};

export default CurrencySelect;
