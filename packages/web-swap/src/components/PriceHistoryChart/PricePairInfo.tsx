import type { FC, ReactNode } from 'react';
import { Button, Dropdown } from '@onekeyhq/ui-components';
import cx from 'classnames';

export type TokenPair = [string] | [string, string];

interface PairDropdownProps {
    tokens: TokenPair;
    onItemSelect?: (pair: string) => void;
}

const PairDropdown: FC<PairDropdownProps> = ({ tokens, onItemSelect }) => {
    const textClasses = 'text-lg font-medium';
    const [first, second] = tokens;
    const upperlizedFirst = first.toUpperCase();
    const upperlizedSecond = second?.toUpperCase() ?? '';

    if (tokens.length === 1) {
        return (
            <div className="py-2 px-4">
                <p className={textClasses}>{upperlizedFirst}</p>
            </div>
        );
    }

    const triggerNode = (
        <Button
            className={cx('flex items-center', textClasses)}
            trailingIcon="ChevronDownSolid"
            type="plain"
        >
            {upperlizedFirst} / {upperlizedSecond}
        </Button>
    );

    const handleItemClick = (v: string) => {
        onItemSelect?.(v);
    };

    const items = (() => {
        const firstToSecond = `${upperlizedFirst} / ${upperlizedSecond}`;
        const secondToFirst = `${upperlizedSecond} / ${upperlizedFirst}`;
        const wrapTitle = (v: string) => <p className="font-normal text-sm">{v}</p>;
        return [
            {
                content: wrapTitle(firstToSecond),
                onAction: () => handleItemClick(firstToSecond),
            },
            {
                content: wrapTitle(secondToFirst),
                onAction: () => handleItemClick(secondToFirst),
            },
            {
                content: wrapTitle(upperlizedFirst),
                onAction: () => handleItemClick(upperlizedFirst),
            },
            {
                content: wrapTitle(upperlizedSecond),
                onAction: () => handleItemClick(upperlizedSecond),
            },
        ];
    })();

    return (
        <Dropdown
            trigger={triggerNode}
            place="bottom-start"
            sections={[
                {
                    items,
                },
            ]}
        />
    );
};

interface PricePairInfoProps {
    tokens: TokenPair;
    subContent?: ReactNode;
    currentPrice?: string;
    onItemSelect?: (pair: string) => void;
}

const PricePairInfo: FC<PricePairInfoProps> = ({
    currentPrice,
    subContent,
    tokens,
    onItemSelect,
}) => {
    return (
        <div className="flex flex-col">
            <PairDropdown tokens={tokens} onItemSelect={onItemSelect} />
            <h2 className="mb-2 text-3xl font-semibold">{currentPrice}</h2>
            {subContent}
        </div>
    );
};

export default PricePairInfo;
