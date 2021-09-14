import { useState, useCallback, useMemo, useEffect } from 'react';
import cx from 'classnames';
import { useIntl } from '@onekeyhq/ui-components/Intl';
import { Card, Button, Popover, Icon } from '@onekeyhq/ui-components';

import {
    ChartWrapper,
    PricePairInfo,
    RangeSelector,
    RangeString,
    TokenPair,
} from '../components/PriceHistoryChart';
import { usePairData, usePastText, useCurrentChange } from '../hooks/chart';
import Settings from '../components/Settings';
import CurrencyInputPanel from '../components/SwapCard/CurrencyInputPanel';
import { Token } from '../components/SwapCard/CurrencySelect';

export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
}
export interface Currencies {
    [Field.INPUT]: string;
    [Field.OUTPUT]: string;
}

const TOKENS: Token[] = [
    {
        symbol: 'ETH',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    {
        symbol: 'USDT',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
];

export const Home = (): JSX.Element => {
    const [range, setRange] = useState<RangeString>('d');

    const { formatMessage } = useIntl();
    const [userHoverX, setUserHoverX] = useState<number>();
    const [, setIndependentField] = useState(Field.INPUT);
    // Control current selected currency
    const [currencies, setCurrencies] = useState<Currencies>({
        [Field.INPUT]: '',
        [Field.OUTPUT]: '',
    });
    const [pair, setPair] = useState<Currencies>(currencies);
    useEffect(() => {
        setPair(prevPair => {
            const isSwitched =
                prevPair[Field.INPUT] === currencies[Field.OUTPUT] &&
                prevPair[Field.OUTPUT] === currencies[Field.INPUT];
            // Still the same, dont change data
            if (isSwitched) {
                return prevPair;
            }
            return currencies;
        });
    }, [currencies]);

    const { data } = usePairData(pair, 1, range);
    const currentPrice = data?.[data?.length - 1][1];
    const pastText = usePastText(range, userHoverX);
    const { currentChange, currentIsRisen } = useCurrentChange(data, userHoverX);

    const handleCurrencySelection = useCallback((field: Field, currencyId: string) => {
        setCurrencies(prevCurrencies => {
            const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
            if (currencyId === prevCurrencies[otherField]) {
                // the case where we have to swap the order
                setIndependentField(prevIndependentField =>
                    prevIndependentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
                );
                return {
                    ...prevCurrencies,
                    [field]: currencyId,
                    [otherField]: prevCurrencies[field],
                };
            } else {
                // the normal case
                return {
                    ...prevCurrencies,
                    [field]: currencyId,
                };
            }
        });
    }, []);

    const handleInputSelect = useCallback(
        inputToken => {
            handleCurrencySelection(Field.INPUT, inputToken.address);
        },
        [handleCurrencySelection],
    );

    const handleOutputSelect = useCallback(
        outputToken => handleCurrencySelection(Field.OUTPUT, outputToken.address),
        [handleCurrencySelection],
    );

    const onSwitchToken = useCallback(() => {
        setCurrencies(prevCurrencies => ({
            [Field.INPUT]: prevCurrencies[Field.OUTPUT],
            [Field.OUTPUT]: prevCurrencies[Field.INPUT],
        }));
    }, []);

    const handleMouseMove = useCallback((price: number) => {
        setUserHoverX(price);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setUserHoverX(undefined);
    }, []);

    const getSymbol = (currencyId: string) =>
        TOKENS.find(({ address }) => address === currencyId)?.symbol;

    const getAddress = (givenSymbol?: string) =>
        TOKENS.find(({ symbol }) => symbol.toLowerCase() === givenSymbol?.toLowerCase())?.address;

    const selectedTokens = useMemo(() => {
        const { [Field.INPUT]: input, [Field.OUTPUT]: output } = currencies;
        const tokens = [getSymbol(input), getSymbol(output)];
        return tokens.filter(Boolean) as TokenPair;
    }, [currencies]);

    const handlePricePairSelect = useCallback(tokenPairString => {
        const [token0, token1] = tokenPairString.split(' / ');
        const token0Addr = getAddress(token0);
        const token1Addr = getAddress(token1);

        setPair({ [Field.INPUT]: token0Addr ?? '', [Field.OUTPUT]: token1Addr ?? '' });
    }, []);

    return (
        // Add bg to prevent overlap by other tailwind configurated libaries
        <div className="bg-white">
            <div className="h-full w-full flex flex-col lg:flex-row">
                <div className="flex px-20 pt-4 items-center flex-1 z-1">
                    <ChartWrapper
                        className="h-[555px]"
                        topLeft={
                            <PricePairInfo
                                currentPrice={
                                    userHoverX?.toFixed(4) ?? currentPrice?.toFixed(4) ?? '-'
                                }
                                subContent={
                                    <div className="flex items-center space-x-2">
                                        <p
                                            className={cx({
                                                'text-red-500': !currentIsRisen,
                                                'text-green-500': currentIsRisen,
                                            })}
                                        >
                                            {currentChange}
                                        </p>
                                        <p className="text-gray-400">{pastText}</p>
                                    </div>
                                }
                                onItemSelect={handlePricePairSelect}
                                tokens={selectedTokens}
                            />
                        }
                        topRight={
                            <RangeSelector
                                range={range}
                                onRangeSelect={range => setRange(range as RangeString)}
                            />
                        }
                        range={range}
                        data={data}
                        chartColor={currentIsRisen ? '#00B812' : '#FF3B30'}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />

                    <Card
                        className="relative min-w-[340px] max-w-[480px] w-full"
                        title={<p>{formatMessage({ id: 'swap' })}</p>}
                        actions={
                            <div className="space-x-2">
                                <Button circular leadingIcon="RefreshSolid" type="plain" />
                                <Popover
                                    place="bottom-end"
                                    className="w-auto min-w-[22rem]"
                                    trigger={(status: boolean) => (
                                        <Button
                                            className={cx({
                                                'okd-bg-gray-100 okd-text-gray-500': status,
                                            })}
                                            circular
                                            leadingIcon="CogSolid"
                                            type="plain"
                                        />
                                    )}
                                >
                                    <Settings />
                                </Popover>
                            </div>
                        }
                    >
                        <div id="swap-page" className="relative">
                            <div className="grid auto-rows-auto gap-y-3">
                                <div className="flex flex-col justify-between space-y-4">
                                    <CurrencyInputPanel
                                        label="You Pay"
                                        tokens={TOKENS}
                                        onUserInput={() => null}
                                        onTokenSelect={handleInputSelect}
                                    />

                                    <div className="flex justify-center py-0 px-4">
                                        <div className="cursor-pointer">
                                            <Icon
                                                name="SwitchVerticalOutline"
                                                onClick={() => {
                                                    onSwitchToken();
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <CurrencyInputPanel
                                        label="You Receive"
                                        tokens={TOKENS}
                                        onUserInput={() => null}
                                        onTokenSelect={handleOutputSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home;
