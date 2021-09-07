import React, { Fragment, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import { FormattedMessage, useIntl } from 'react-intl';
import { isNil } from 'lodash';

import Layout from '@layout/Main';
import Icon from '@components/Icon';
import Stats from '@components/Stats';
import StatsCard from '@components/StatsCard';
import Image from '@components/Image';
import Badge from '@components/Badge';
import Avatar from '@components/Avatar';
import Tooltip from '@components/Tooltip';
import useAPIUpdate from '@components/APIUpdater/hooks';
import { shortenAddress } from '@components/Connection/utils';
import { changeActivePlatform } from '@store/actions';

export default function Overview() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const data = useSelector(s => s.payload);
    const [activeAddress, setIsOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const { handleRequest, isFetching } = useAPIUpdate();

    const activeData = data ? data[activeAddress] : {};

    const handleOpenModal = useCallback(
        address => {
            setIsOpen(address);
        },
        [setIsOpen],
    );

    const handleChangePlatform = useCallback(
        id => {
            dispatch(changeActivePlatform(id));
        },
        [dispatch],
    );

    function toggleShowMore() {
        setShowMore(value => !value);
    }

    return (
        <Layout
            pageTitle={intl.formatMessage({
                id: 'form__overview',
            })}
        >
            {/* Main Stats */}
            <div className="pb-6 border-b border-gray-200 lg:-mt-2 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <Stats
                        label={intl.formatMessage({
                            id: 'form__total_value',
                        })}
                        amount={data?.total?.totalValue}
                        size="lg"
                    />
                    <div>
                        <button
                            onClick={handleRequest}
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isFetching}
                        >
                            {!isFetching ? (
                                <Icon
                                    name="solid-refresh"
                                    className="w-5 h-5 text-gray-400 sm:-ml-1"
                                />
                            ) : (
                                <Icon
                                    name="outline-spin"
                                    className="w-5 h-5 text-gray-900 sm:-ml-1 animate-spin dark:text-white"
                                />
                            )}
                            <span className="hidden ml-3 sm:inline-block">
                                {isFetching
                                    ? intl.formatMessage({ id: 'action__request_loading' })
                                    : intl.formatMessage({ id: 'action__request_refresh' })}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="grid grid-cols-2 gap-4 lg:space-x-8 md:grid-cols-4 lg:flex">
                        <Stats
                            label={intl.formatMessage({
                                id: 'form__assets',
                            })}
                            amount={data?.total?.assets}
                            size="sm"
                        />
                        <Stats
                            label={intl.formatMessage({
                                id: 'form__debt',
                            })}
                            amount={data?.total?.debt}
                            size="sm"
                        />
                        <Stats
                            label={intl.formatMessage({
                                id: 'form__reward',
                            })}
                            amount={data?.total?.reward}
                            positive
                        />
                        <Stats
                            label={intl.formatMessage({
                                id: 'form__apy_uppercase',
                            })}
                            amount={data?.total?.apy}
                            type="percent"
                            suffix="%"
                            prefix={null}
                            size="sm"
                            positive
                            dataFor="apyTooltip"
                            dataTip
                        />
                    </div>
                    <Tooltip id="apyTooltip">
                        <div className="max-w-xs space-y-3">
                            <p>
                                <FormattedMessage id="modal__what_is_apy_description_apy_stands_for_annual_percentage_yield" />
                            </p>
                        </div>
                    </Tooltip>
                </div>
            </div>
            {/* Main Stats End */}
            {/* Details */}
            <div className="mt-8 space-y-8">
                {/* Wallet */}
                <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        <FormattedMessage id="form__wallet" />
                    </h2>
                    <div className="mt-2 space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 xl:grid-cols-3 xl:gap-5">
                        {data?.total ? (
                            Object.entries(data)
                                .filter(([key]) => !!(key !== 'total'))
                                .map(([address, payload]) => {
                                    return (
                                        <StatsCard
                                            key={address}
                                            label={shortenAddress(address)}
                                            amount={payload.totalValue}
                                            address={address}
                                            icon="outline-expand"
                                            onClick={() => handleOpenModal(address)}
                                        />
                                    );
                                })
                        ) : (
                            <div className="flex items-center px-6 py-4 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center animate-pulse">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-600" />
                                    <div className="ml-3">
                                        <div className="h-3 mt-2 mb-2.5 bg-gray-300 rounded-full w-28 dark:bg-gray-600" />
                                        <div className="h-3.5 mb-2 bg-gray-300 rounded-full w-36 dark:bg-gray-600" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Wallet End */}
                {/* Platforms */}
                <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        <FormattedMessage id="form__platform" />
                    </h2>
                    <div className="mt-2 space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 xl:grid-cols-3 xl:gap-5">
                        {!isNil(data?.total?.protocols) ? (
                            data.total.protocols.map(protocol => {
                                return (
                                    <StatsCard
                                        key={protocol.id}
                                        label={protocol.name}
                                        amount={protocol.totalValue}
                                        imgSrc={`${protocol.logo_url}`}
                                        icon="outline-chevron-right"
                                        type="platform"
                                        chainType={`${protocol.chain}`.toUpperCase()}
                                        onClick={() => handleChangePlatform(protocol.id)}
                                    />
                                );
                            })
                        ) : (
                            <div className="flex items-center px-6 py-4 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center animate-pulse">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-600" />
                                    <div className="ml-3">
                                        <div className="h-3 mt-2 mb-2.5 bg-gray-300 rounded-full w-28 dark:bg-gray-600" />
                                        <div className="h-3.5 mb-2 bg-gray-300 rounded-full w-36 dark:bg-gray-600" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Platforms End */}
            </div>
            {/* Details End */}
            {/* Wallet Detail Modal */}
            <Transition.Root show={!!activeAddress} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 z-10 w-full overflow-y-auto"
                    open={!!activeAddress}
                    onClose={setIsOpen}
                >
                    <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500/75 dark:bg-gray-600/75" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block w-full max-h-full p-4 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
                                {/* Modal Header */}
                                <div className="flex items-center px-4 py-3 mb-4 -mx-4 -mt-4 border-b border-gray-200 sm:mb-6 sm:px-6 sm:py-4 sm:-mt-6 sm:-mx-6 dark:border-gray-700">
                                    <Dialog.Title
                                        as="h3"
                                        className="flex-1 text-lg font-medium leading-6 text-gray-900 truncate dark:text-gray-50"
                                    >
                                        <FormattedMessage id="form__wallet" />
                                    </Dialog.Title>
                                    <div className="flex items-center flex-shrink-0 ml-4">
                                        <button
                                            type="button"
                                            className="flex items-center p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-gray-500 dark:hover:text-gray-400 dark:ring-offset-gray-900"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="sr-only">Close</span>
                                            <Icon
                                                name="solid-x"
                                                className="w-5 h-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>
                                {/* Modal Body */}
                                <div className="space-y-6">
                                    {/* Stats */}
                                    <div className="sm:flex sm:flex-row-reverse sm:justify-between sm:items-start">
                                        <div className="flex items-center mb-4 text-sm text-gray-700 dark:text-gray-200 sm:mb-0">
                                            <div className="w-5 h-5">
                                                <Avatar address={activeAddress} size="20" />
                                            </div>
                                            <span className="ml-3 font-mono">
                                                {activeAddress
                                                    ? shortenAddress(activeAddress)
                                                    : '-'}
                                            </span>
                                        </div>
                                        <Stats
                                            label={intl.formatMessage({
                                                id: 'form__total_value',
                                            })}
                                            amount={activeData?.totalValue}
                                        />
                                    </div>
                                    {/* Detail */}
                                    <div className="border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center">
                                                <div className="font-medium text-gray-900 dark:text-gray-50">
                                                    <FormattedMessage id="form__assets" />
                                                </div>
                                                <Badge className="ml-3">
                                                    {activeData?.tokens?.length ?? '-'}
                                                </Badge>
                                            </div>
                                        </div>
                                        {/* The two outer div that wrapped table are used for scrolling when overflow */}
                                        <div className="-mx-4 overflow-x-auto sm:-mx-6">
                                            <div className="inline-flex mx-4 sm:mx-6 min-w-[calc(100%-32px)] sm:min-w-[calc(100%-48px)]">
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-1.5 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 first:pl-0 last:pr-0"
                                                            >
                                                                <FormattedMessage id="form__token" />
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-1.5 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 first:pl-0 last:pr-0"
                                                            >
                                                                <FormattedMessage id="form__value" />
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-1.5 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 first:pl-0 last:pr-0"
                                                            >
                                                                <FormattedMessage id="form__total_value" />
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activeData?.tokens
                                                            ?.map(token => {
                                                                const { price, amount } = token;
                                                                return {
                                                                    ...token,
                                                                    totalValue: new BigNumber(price)
                                                                        .multipliedBy(
                                                                            new BigNumber(amount),
                                                                        )
                                                                        .toFixed(2),
                                                                    price: new BigNumber(
                                                                        price,
                                                                    ).toFixed(2),
                                                                    amount: new BigNumber(
                                                                        amount,
                                                                    ).toFixed(2),
                                                                };
                                                            })
                                                            ?.filter(token => {
                                                                if (showMore) return true;
                                                                if (
                                                                    new BigNumber(
                                                                        token.totalValue,
                                                                    ).comparedTo(
                                                                        new BigNumber(100),
                                                                    ) >= 0
                                                                ) {
                                                                    return true;
                                                                }
                                                                return false;
                                                            })
                                                            ?.sort((a, b) => {
                                                                return new BigNumber(
                                                                    b.totalValue,
                                                                ).comparedTo(
                                                                    new BigNumber(a.totalValue),
                                                                );
                                                            })
                                                            ?.map(token => (
                                                                <tr key={token.name}>
                                                                    <td className="px-1.5 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                                        <div className="flex items-center min-w-[100px]">
                                                                            <div className="flex flex-shrink-0 mr-3 overflow-hidden rounded-full">
                                                                                {token.logo_url ? (
                                                                                    <Image
                                                                                        src={
                                                                                            token.logo_url
                                                                                        }
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
                                                                            <div className="font-medium text-gray-900 sm:flex">
                                                                                {token.symbol}
                                                                                <div className="font-normal text-gray-500 sm:ml-1">
                                                                                    on BSC
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-1.5 py-3 text-sm text-left text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                                        {token.price}
                                                                    </td>
                                                                    <td className="px-1.5 py-3 text-sm text-right text-gray-700 dark:text-gray-200 whitespace-nowrap first:pl-0 last:pr-0">
                                                                        {token.totalValue}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-offset-gray-900"
                                            onClick={toggleShowMore}
                                        >
                                            {showMore
                                                ? intl.formatMessage({
                                                      id: 'action__hide_tokens_under_100_usd',
                                                  })
                                                : intl.formatMessage({
                                                      id: 'action__show_tokens_under_100_usd',
                                                  })}
                                            <Icon
                                                className={classNames(
                                                    'w-5 h-5 text-gray-400 dark:text-gray-500 ml-3',
                                                    { '-rotate-180': showMore },
                                                )}
                                                name="solid-chevron-down"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </Layout>
    );
}
