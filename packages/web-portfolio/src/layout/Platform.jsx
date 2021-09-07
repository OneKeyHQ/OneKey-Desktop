/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { isNil, groupBy, omit, flatten } from 'lodash';
import BigNumber from 'bignumber.js';
import { FormattedMessage, useIntl } from 'react-intl';

import Layout from '@layout/Main';
import Image from '@components/Image';
import Avatar from '@components/Avatar';
import Tooltip from '@components/Tooltip';
import Stats from '@components/Stats';
import Icon from '@components/Icon';
import { shortenAddress } from '@components/Connection/utils';

import { changeActivePlatform } from '@store/actions';

const TYPE_TRANSLATION_ID = {
    common: 'content__type_common',
    leveraged_farming: 'content__type_leveraged_farming',
    reward: 'content__type_reward',
    lending: 'content__type_lending',
};

const LeveragedFarming = ({ address, data }) => {
    const tokens = data?.detail?.supply_token_list ?? data?.detail?.token_list ?? [];
    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-wrap p-3 border-b border-gray-200 sm:px-6 sm:py-5 sm:flex sm:items-center sm:justify-between bg-gray-50 dark:bg-white/5 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    {/* Tokens Group */}
                    <div className="flex -space-x-4">
                        {tokens.map(token => {
                            return (
                                <div
                                    key={token.symbol}
                                    className="relative inline-flex overflow-hidden bg-white border border-gray-200 rounded-full shadow-sm dark:border-gray-700"
                                >
                                    {token.logo_url ? (
                                        <Image src={token.logo_url} width="30px" height="30px" />
                                    ) : (
                                        <Icon
                                            name="solid-question-mark-circle"
                                            className="w-[30px] h-[30px] text-gray-300 dark:text-gray-400"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Title */}
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        {tokens.map(token => token.symbol).join(' \\ ')}
                    </h2>
                </div>
                <div className="flex items-center mt-4 ml-1.5 sm:my-1.5">
                    <div className="w-5 h-5">
                        <Avatar address={address} size="20" />
                    </div>
                    <span className="ml-3 font-mono text-sm text-gray-500 dark:text-gray-400">
                        {shortenAddress(address)}
                    </span>
                </div>
            </div>
            {/* Card Header End */}
            {/* Card Body */}
            <div className="px-4 overflow-auto divide-y divide-gray-200 sm:px-6 dark:divide-gray-700">
                <div className="py-3" key="first">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                >
                                    <FormattedMessage id="form__debt_rate" />
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                >
                                    <FormattedMessage id="form__value" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                    <div className="flex items-center">
                                        <div className="flex flex-wrap flex-1">
                                            <span className="mr-2">
                                                {new BigNumber(data.detail.debt_ratio)
                                                    .multipliedBy(new BigNumber(100))
                                                    .toFixed(2)}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    className={classNames(
                                        'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                        {
                                            'text-gray-700 dark:text-gray-200': true,
                                            // "text-green-600 dark:text-green-500": positive,
                                            // "text-red-600 dark:text-red-400": negative,
                                        },
                                    )}
                                >
                                    ${new BigNumber(data.stats.net_usd_value).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {data?.detail.borrow_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__borrowed" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.borrow_token_list?.map(borrowToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={borrowToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {borrowToken.logo_url ? (
                                                            <Image
                                                                src={borrowToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                borrowToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {borrowToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(borrowToken.amount)
                                                    .multipliedBy(new BigNumber(borrowToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {data?.detail.supply_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__supplied" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.supply_token_list?.map(suppleToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={suppleToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {suppleToken.logo_url ? (
                                                            <Image
                                                                src={suppleToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                suppleToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {suppleToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(suppleToken.amount)
                                                    .multipliedBy(new BigNumber(suppleToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {data?.detail.reward_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__reward" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.reward_token_list?.map(suppleToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={suppleToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {suppleToken.logo_url ? (
                                                            <Image
                                                                src={suppleToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                suppleToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {suppleToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(suppleToken.amount)
                                                    .multipliedBy(new BigNumber(suppleToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const Staked = ({ address, data }) => {
    const tokens = data?.detail?.supply_token_list ?? data?.detail?.token_list ?? [];
    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Card Header */}
            <div className="flex-wrap p-3 border-b border-gray-200 sm:px-6 sm:py-5 sm:flex sm:items-center sm:justify-between bg-gray-50 dark:bg-white/5 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    {/* Tokens Group */}
                    <div className="flex -space-x-4">
                        {tokens.map(token => {
                            return (
                                <div
                                    key={token.symbol}
                                    className="relative inline-flex overflow-hidden bg-white border border-gray-200 rounded-full shadow-sm dark:border-gray-700"
                                >
                                    {token.logo_url ? (
                                        <Image src={token.logo_url} width="30px" height="30px" />
                                    ) : (
                                        <Icon
                                            name="solid-question-mark-circle"
                                            className="w-[30px] h-[30px] text-gray-300 dark:text-gray-400"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Title */}
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        {tokens.map(token => token.symbol).join(' \\ ')}
                    </h2>
                </div>
                <div className="flex items-center mt-4 ml-1.5 sm:my-1.5">
                    <div className="w-5 h-5">
                        <Avatar address={address} size="20" />
                    </div>
                    <span className="ml-3 font-mono text-sm text-gray-500 dark:text-gray-400">
                        {shortenAddress(address)}
                    </span>
                </div>
            </div>
            {/* Card Header End */}
            {/* Card Body */}
            <div className="px-4 overflow-auto divide-y divide-gray-200 sm:px-6 dark:divide-gray-700">
                <div className="py-3" key="first">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                >
                                    <FormattedMessage id="form__apy_uppercase" />
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                >
                                    <FormattedMessage id="form__farm_apy" />
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                >
                                    <FormattedMessage id="form__value" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                    <div className="flex items-center">
                                        <div className="flex flex-wrap flex-1">
                                            <span className="mr-2">
                                                {new BigNumber(data.detail.daily_yield_rate)
                                                    .multipliedBy(new BigNumber(36500))
                                                    .toFixed(2)}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    className={classNames(
                                        'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                        {
                                            'text-gray-700 dark:text-gray-200': true,
                                            // "text-green-600 dark:text-green-500": positive,
                                            // "text-red-600 dark:text-red-400": negative,
                                        },
                                    )}
                                >
                                    {new BigNumber(data.detail.daily_farm_rate)
                                        .multipliedBy(new BigNumber(36500))
                                        .toFixed(2)}
                                    %
                                </td>
                                <td
                                    className={classNames(
                                        'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                        {
                                            'text-gray-700 dark:text-gray-200': true,
                                            // "text-green-600 dark:text-green-500": positive,
                                            // "text-red-600 dark:text-red-400": negative,
                                        },
                                    )}
                                >
                                    ${new BigNumber(data.stats.net_usd_value).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {data?.detail.borrow_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__borrowed" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.borrow_token_list?.map(borrowToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={borrowToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {borrowToken.logo_url ? (
                                                            <Image
                                                                src={borrowToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                borrowToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {borrowToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(borrowToken.amount)
                                                    .multipliedBy(new BigNumber(borrowToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {data?.detail.supply_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__supplied" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.supply_token_list?.map(suppleToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={suppleToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {suppleToken.logo_url ? (
                                                            <Image
                                                                src={suppleToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                suppleToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {suppleToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(suppleToken.amount)
                                                    .multipliedBy(new BigNumber(suppleToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {data?.detail.reward_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__reward" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.reward_token_list?.map(suppleToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={suppleToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {suppleToken.logo_url ? (
                                                            <Image
                                                                src={suppleToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                suppleToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {suppleToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(suppleToken.amount)
                                                    .multipliedBy(new BigNumber(suppleToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const Reward = ({ address, data }) => {
    const tokens = data?.detail?.token_list ?? [];
    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Card Header */}
            <div className="flex-wrap p-3 border-b border-gray-200 sm:px-6 sm:py-5 sm:flex sm:items-center sm:justify-between bg-gray-50 dark:bg-white/5 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    {/* Tokens Group */}
                    <div className="flex -space-x-4">
                        {tokens.map(token => {
                            return (
                                <div
                                    key={token.symbol}
                                    className="relative inline-flex overflow-hidden bg-white border border-gray-200 rounded-full shadow-sm dark:border-gray-700"
                                >
                                    {token.logo_url ? (
                                        <Image src={token.logo_url} width="30px" height="30px" />
                                    ) : (
                                        <Icon
                                            name="solid-question-mark-circle"
                                            className="w-[30px] h-[30px] text-gray-300 dark:text-gray-400"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Title */}
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        {tokens.map(token => token.symbol).join(' \\ ')}
                    </h2>
                </div>
                <div className="flex items-center mt-4 ml-1.5 sm:my-1.5">
                    <div className="w-5 h-5">
                        <Avatar address={address} size="20" />
                    </div>
                    <span className="ml-3 font-mono text-sm text-gray-500 dark:text-gray-400">
                        {shortenAddress(address)}
                    </span>
                </div>
            </div>
            {/* Card Header End */}
            {/* Card Body */}
            <div className="px-4 overflow-auto divide-y divide-gray-200 sm:px-6 dark:divide-gray-700">
                {data?.detail.token_list?.map(borrowToken => {
                    const neutral = false;
                    const positive = true;
                    const negative = false;

                    return (
                        <div className="py-3" key={borrowToken.id}>
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                        >
                                            <FormattedMessage id="form__reward" />
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                        >
                                            <FormattedMessage id="form__value" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                            <div className="flex items-center">
                                                <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 rounded-full">
                                                    {!!borrowToken.logo_url && (
                                                        <Image
                                                            src={borrowToken.logo_url}
                                                            width="24px"
                                                            height="24px"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap flex-1">
                                                    <span className="mr-2">
                                                        {new BigNumber(borrowToken.amount).toFixed(
                                                            2,
                                                        )}{' '}
                                                        {borrowToken.optimized_symbol}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            className={classNames(
                                                'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                {
                                                    'text-gray-700 dark:text-gray-200': neutral,
                                                    'text-green-600 dark:text-green-500': positive,
                                                    'text-red-600 dark:text-red-400': negative,
                                                },
                                            )}
                                        >
                                            $
                                            {new BigNumber(borrowToken.amount)
                                                .multipliedBy(new BigNumber(borrowToken.price))
                                                .toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Lending = ({ address, data }) => {
    const tokens = data?.detail?.token_list ?? [];
    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Card Header */}
            <div className="flex-wrap p-3 border-b border-gray-200 sm:px-6 sm:py-5 sm:flex sm:items-center sm:justify-between bg-gray-50 dark:bg-white/5 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    {/* Tokens Group */}
                    <div className="flex -space-x-4">
                        {tokens.map(token => {
                            return (
                                <div
                                    key={token.symbol}
                                    className="relative inline-flex overflow-hidden bg-white border border-gray-200 rounded-full shadow-sm dark:border-gray-700"
                                >
                                    {token.logo_url ? (
                                        <Image src={token.logo_url} width="30px" height="30px" />
                                    ) : (
                                        <Icon
                                            name="solid-question-mark-circle"
                                            className="w-[30px] h-[30px] text-gray-300 dark:text-gray-400"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Title */}
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        {tokens.map(token => token.symbol).join(' \\ ')}
                    </h2>
                </div>
                <div className="flex items-center mt-4 ml-1.5 sm:my-1.5">
                    <div className="w-5 h-5">
                        <Avatar address={address} size="20" />
                    </div>
                    <span className="ml-3 font-mono text-sm text-gray-500 dark:text-gray-400">
                        {shortenAddress(address)}
                    </span>
                </div>
            </div>
            {/* Card Header End */}
            {/* Card Body */}
            <div className="px-4 overflow-auto divide-y divide-gray-200 sm:px-6 dark:divide-gray-700">
                {data?.detail.supply_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__supplied" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__apy_uppercase" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__farm_apy" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.supply_token_list?.map(borrowToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={borrowToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {borrowToken.logo_url ? (
                                                            <Image
                                                                src={borrowToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                borrowToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {borrowToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': true,
                                                        // "text-green-600 dark:text-green-500": positive,
                                                        // "text-red-600 dark:text-red-400": negative,
                                                    },
                                                )}
                                            >
                                                {!isNil(borrowToken.daily_yield_rate)
                                                    ? new BigNumber(borrowToken.daily_yield_rate)
                                                          .multipliedBy(new BigNumber(36500))
                                                          .toFixed(2)
                                                    : '-'}
                                                %
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': true,
                                                        // "text-green-600 dark:text-green-500": positive,
                                                        // "text-red-600 dark:text-red-400": negative,
                                                    },
                                                )}
                                            >
                                                {!isNil(borrowToken.daily_farm_rate)
                                                    ? new BigNumber(borrowToken.daily_farm_rate)
                                                          .multipliedBy(new BigNumber(36500))
                                                          .toFixed(2)
                                                    : '-'}
                                                %
                                            </td>

                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(borrowToken.amount)
                                                    .multipliedBy(new BigNumber(borrowToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {data?.detail.borrow_token_list && (
                    <div className="py-3">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__borrowed" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__apy_uppercase" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__farm_apy" />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap first:pl-0 last:pr-0"
                                    >
                                        <FormattedMessage id="form__value" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.detail.borrow_token_list?.map(borrowToken => {
                                    const neutral = false;
                                    const positive = true;
                                    const negative = false;

                                    return (
                                        <tr key={borrowToken.id}>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                <div className="flex items-center">
                                                    <div className="flex flex-shrink-0 w-6 h-6 ml-1 mr-3 overflow-hidden rounded-full">
                                                        {borrowToken.logo_url ? (
                                                            <Image
                                                                src={borrowToken.logo_url}
                                                                width="24px"
                                                                height="24px"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="solid-question-mark-circle"
                                                                className="w-6 h-6 text-gray-300 dark:text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap flex-1">
                                                        <span className="mr-2">
                                                            {new BigNumber(
                                                                borrowToken.amount,
                                                            ).toFixed(2)}{' '}
                                                            {borrowToken.optimized_symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': true,
                                                        // "text-green-600 dark:text-green-500": positive,
                                                        // "text-red-600 dark:text-red-400": negative,
                                                    },
                                                )}
                                            >
                                                {!isNil(borrowToken.daily_yield_rate)
                                                    ? new BigNumber(borrowToken.daily_yield_rate)
                                                          .multipliedBy(new BigNumber(36500))
                                                          .toFixed(2)
                                                    : '-'}
                                                %
                                            </td>
                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': true,
                                                        // "text-green-600 dark:text-green-500": positive,
                                                        // "text-red-600 dark:text-red-400": negative,
                                                    },
                                                )}
                                            >
                                                {!isNil(borrowToken.daily_farm_rate)
                                                    ? new BigNumber(borrowToken.daily_farm_rate)
                                                          .multipliedBy(new BigNumber(36500))
                                                          .toFixed(2)
                                                    : '-'}
                                                %
                                            </td>

                                            <td
                                                className={classNames(
                                                    'px-3 py-2 text-sm font-medium text-right whitespace-nowrap first:pl-0 last:pr-0',
                                                    {
                                                        'text-gray-700 dark:text-gray-200': neutral,
                                                        'text-green-600 dark:text-green-500': positive,
                                                        'text-red-600 dark:text-red-400': negative,
                                                    },
                                                )}
                                            >
                                                $
                                                {new BigNumber(borrowToken.amount)
                                                    .multipliedBy(new BigNumber(borrowToken.price))
                                                    .toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const NotSupport = () => {
    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-wrap p-3 border-b border-gray-200 sm:px-6 sm:py-5 sm:flex sm:items-center sm:justify-between bg-gray-50 dark:bg-white/5 dark:border-gray-700">
                Not Support Yet.
                <FormattedMessage id="form__not_support" />
            </div>
        </div>
    );
};

export default function Platform() {
    const dispatch = useDispatch();
    const intl = useIntl();
    const handleChangeActivePlatform = useCallback(() => {
        dispatch(changeActivePlatform(''));
    }, [dispatch]);

    const payload = useSelector(s => s.payload);
    const activePlatform = useSelector(s => s.active.platform);
    const activeChain = useSelector(s => s.active.chain);

    const currentPlatformData = useMemo(() => {
        const accounts = Object.entries(payload)
            .filter(([key]) => key !== 'total')
            .reduce((memo, [key, value]) => {
                const target = value.protocols.find(
                    item =>
                        item.id === activePlatform &&
                        (activeChain ? item.chain === activeChain : true),
                );
                if (!target) return memo;
                return {
                    ...memo,
                    [key]: target,
                };
            }, {});
        return accounts;
    }, [activePlatform, payload, activeChain]);

    const activePlatformDetail = Object.values(currentPlatformData)[0];
    const activePlatformTotal =
        payload?.total?.protocols?.find(item => item.id === activePlatform) ?? {};

    const groupRenderData = useMemo(() => {
        const platformDataList = flatten(
            Object.entries(currentPlatformData).reduce((memo, current) => {
                const [key, value] = current;
                return [
                    ...memo,
                    value.portfolio_item_list.map(item => {
                        return {
                            address: key,
                            ...omit(value, 'portfolio_item_list'),
                            portfolio_item: item,
                        };
                    }),
                ];
            }, []),
        );
        const groups = groupBy(platformDataList, item => item.portfolio_item.detail_types[0]);
        return groups;
    }, [currentPlatformData]);

    return (
        <Layout
            back={handleChangeActivePlatform}
            pageTitle={
                <div className="flex items-center">
                    <div className="relative flex mr-3">
                        <div className="inline-flex overflow-hidden rounded-full">
                            <Image
                                src={activePlatformDetail?.logo_url}
                                width="24px"
                                height="24px"
                                alt={activePlatformDetail?.name ?? '-'}
                            />
                        </div>
                        <div className="absolute -right-2 -top-2">
                            <Image
                                className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-900"
                                src={`/chain/${activePlatformDetail?.chain?.toUpperCase()}.svg`}
                                alt={activePlatformDetail?.chain?.toUpperCase()}
                            />
                            {/* Placeholder when returning nothing */}
                            {/* <Icon name="solid-question-mark-circle" className="w-[18px] h-[18px] text-gray-300 bg-white rounded-full dark:text-gray-400 dark:bg-gray-800" /> */}
                        </div>
                    </div>
                    <div>
                        {activePlatformDetail?.name ?? '-'}&nbsp;&nbsp;
                        <span className="text-gray-500 dark:text-gray-400">
                            on {activePlatformDetail?.chain?.toUpperCase() ?? '-'}
                        </span>
                    </div>
                </div>
            }
        >
            <div className="pb-6 border-b border-gray-200 lg:-mt-2 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <Stats
                        label={intl.formatMessage({
                            id: 'form__total_value',
                        })}
                        amount={activePlatformTotal.totalValue}
                        size="lg"
                    />
                </div>
                {(!isNil(activePlatformTotal.reward) || !isNil(activePlatformTotal.apy)) && (
                    <div className="mt-6">
                        <div className="grid grid-cols-2 gap-4 lg:space-x-8 md:grid-cols-4 lg:flex">
                            {!isNil(activePlatformTotal.reward) && (
                                <Stats
                                    label={intl.formatMessage({ id: 'form__reward' })}
                                    amount={activePlatformTotal.reward}
                                    positive
                                />
                            )}
                            {!isNil(activePlatformTotal.apy) && (
                                <Stats
                                    label={intl.formatMessage({ id: 'form__apy_uppercase' })}
                                    amount={new BigNumber(activePlatformTotal.apy).toFixed(2)}
                                    prefix={null}
                                    suffix="%"
                                    size="sm"
                                    positive
                                    dataFor="apyTooltip"
                                    dataTip
                                />
                            )}
                        </div>
                        <Tooltip id="apyTooltip">
                            <div className="max-w-xs space-y-3">
                                <p>
                                    <FormattedMessage id="modal__what_is_apy_description_apy_stands_for_annual_percentage_yield" />
                                </p>
                            </div>
                        </Tooltip>
                    </div>
                )}
            </div>

            <div className="mt-8 space-y-8">
                {/* Card */}
                {Object.entries(groupRenderData).map(([type, list]) => {
                    return (
                        <div key={type}>
                            <h2 className="text-lg font-medium text-gray-900 capitalize dark:text-gray-50">
                                {TYPE_TRANSLATION_ID[type]
                                    ? intl.formatMessage({ id: TYPE_TRANSLATION_ID[type] })
                                    : type}
                            </h2>
                            <div className="mt-2 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5">
                                {list.map((portfolioItem, index) => {
                                    if (type === 'reward') {
                                        // 奖励类型
                                        return (
                                            <Reward
                                                address={portfolioItem.address}
                                                key={portfolioItem.address + index}
                                                data={portfolioItem.portfolio_item}
                                            />
                                        );
                                    }
                                    if (type === 'leveraged_farming') {
                                        // 杠杆挖矿
                                        return (
                                            <LeveragedFarming
                                                address={portfolioItem.address}
                                                key={portfolioItem.address + index}
                                                data={portfolioItem.portfolio_item}
                                            />
                                        );
                                    }
                                    if (type === 'common') {
                                        // 普通类型 Staked
                                        return (
                                            <Staked
                                                address={portfolioItem.address}
                                                key={portfolioItem.address + index}
                                                data={portfolioItem.portfolio_item}
                                            />
                                        );
                                    }
                                    if (type === 'lending') {
                                        // 借贷类型 lending
                                        return (
                                            <Lending
                                                address={portfolioItem.address}
                                                key={portfolioItem.address + index}
                                                data={portfolioItem.portfolio_item}
                                            />
                                        );
                                    }
                                    return <NotSupport key={portfolioItem.address + index} />;
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}
