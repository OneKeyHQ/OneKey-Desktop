import React, { FC, useState } from 'react';
import cx, { Argument } from 'classnames';
import { Popover, Button, RadioButtonGroup, Input } from '@onekeyhq/ui-components';
import SettingsItem from './SettingsItem';
import { DescriptionList } from '../index';

const PriceSlippage = () => {
    const [selected, setSelected] = useState('min');

    return (
        <>
            <SettingsItem
                title="Price Slippage"
                description="The maximum percentage you are willing to lose due to unfavorable price
            changes."
            >
                <div className="flex items-center">
                    <RadioButtonGroup
                        value={selected}
                        onChange={setSelected}
                        label="Price Slippage"
                    >
                        <RadioButtonGroup.Option value="min" label="0.1%" />
                        <RadioButtonGroup.Option value="medium" label="0.5%" />
                        <RadioButtonGroup.Option value="max" label="1%" />
                    </RadioButtonGroup>
                    <Input
                        value={selected}
                        addonAfter="%"
                        className="w-20 ml-2"
                        paddingRight={32}
                    />
                </div>
                <DescriptionList className="mt-3">
                    <DescriptionList.Item itemKey="Minimum Received" itemValue="5.35167" />
                </DescriptionList>
            </SettingsItem>
        </>
    );
};

const Gas = () => {
    const [selected, setSelected] = useState('standard');

    return (
        <>
            <SettingsItem title="Gas Setting" description="Gas affects the speed of transactions.">
                <RadioButtonGroup
                    value={selected}
                    onChange={setSelected}
                    label="Price Slippage"
                    className="w-full"
                >
                    <RadioButtonGroup.Option
                        value="standard"
                        label="Standard"
                        description="6 Gwei"
                        className="flex-1"
                    />
                    <RadioButtonGroup.Option
                        value="fast"
                        label="Fast"
                        description="10 Gwei"
                        className="flex-1"
                    />
                    <RadioButtonGroup.Option
                        value="rapid"
                        label="Rapid"
                        description="15 Gwei"
                        className="flex-1"
                    />
                </RadioButtonGroup>
                <Input className="mt-2" value={selected} addonAfter="Gwei" paddingRight={32} />
            </SettingsItem>
        </>
    );
};

type TransactionSettingsProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
    /**
     * 是否展示滑点
     */
    priceSlippage?: boolean;
    /**
     * 是否展示 gas
     */
    gas?: boolean;
};

const defaultProps = {} as const;

const TransactionSettings: FC<TransactionSettingsProps> = ({
    className,
    priceSlippage,
    gas,
    ...rest
}) => {
    return (
        <>
            <Popover
                trigger={status => (
                    <Button
                        circular
                        type="plain"
                        leadingIcon="CogSolid"
                        className={status && 'bg-gray-100'}
                    />
                )}
                className={cx('min-w-[324px]', !!className && className)}
                {...rest}
            >
                <div className="p-4 space-y-8 text-sm">
                    {priceSlippage && <PriceSlippage />}
                    {gas && <Gas />}
                </div>
            </Popover>
        </>
    );
};

TransactionSettings.defaultProps = defaultProps;

export default TransactionSettings;
