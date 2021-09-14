import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Button, Dropdown } from '@onekeyhq/ui-components';
import cx from 'classnames';

export type TokenPair = [] | [string] | [string, string] | undefined;

interface PairDropdownProps {
    tokens: TokenPair;
    onItemSelect?: (pair: string) => void;
}

const PairDropdown: FC<PairDropdownProps> = ({ tokens, onItemSelect }) => {
    const [currentSelected, setCurrentSelected] = useState<string>();

    if (!tokens?.length) {
        return <div>No token selected</div>;
    }

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
            {currentSelected || `${upperlizedFirst} / ${upperlizedSecond}`}
        </Button>
    );

    const handleItemClick = (v: string) => {
        setCurrentSelected(v);
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
            className="z-10"
            trigger={triggerNode}
            place="bottom-start"
            sections={[{ items }]}
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
            <h2 className="mb-2 text-3xl font-semibold text-gray-900">{currentPrice}</h2>
            {subContent}
        </div>
    );
};

export default PricePairInfo;
