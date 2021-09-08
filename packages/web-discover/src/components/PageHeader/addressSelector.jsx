/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { Fragment, useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Popover, Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FormattedMessage, useIntl } from 'react-intl';

import { shortenAddress, isAddress } from '@components/Connection/utils';
import ConnectionButton from '@components/ConnectionButton';
import Badge from '@components/Badge';
import Icon from '@components/Icon';
import Switch from '@components/Switch';
import Avatar from '@components/Avatar';
import Tooltip from '@components/Tooltip';

import {
    addWatchAddress,
    changeBundle,
    clearAddresses,
    deleteAccount,
    changeLabel,
    changeActive,
} from '@store/actions';

export default function AddressSelector() {
    const intl = useIntl();
    const walletSelectorBtn = useRef();
    const initialFocusInput = useRef();
    const labelInput = useRef();
    const addresses = useSelector(s => s.device);
    const dispatch = useDispatch();
    const [address, setAddress] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const { watchedAddresses, connectedAddress, bundledAddresses } = useMemo(() => {
        return {
            watchedAddresses: addresses.filter(account => account.type === 'watched') ?? [],
            connectedAddress: addresses.find(account => account.type === 'connected'),
            bundledAddresses: addresses.filter(account => !!account.bundle),
        };
    }, [addresses]);
    const labelModalActiveAccount = useMemo(() => {
        return addresses.find(item => item.address === isCreateLabelModalOpen);
    }, [addresses, isCreateLabelModalOpen]);

    const { activeType: selectType, address: activeAddress } = useSelector(s => s.active.account);
    const storeAddress =
        selectType === 'single'
            ? activeAddress
            : selectType === 'connected'
            ? connectedAddress?.address
            : watchedAddresses?.[0]?.address;
    const selectAddress = selectType === 'bundle' ? '' : storeAddress;

    useEffect(() => {
        if (copied) {
            setTimeout(() => setCopied(false), 1000);
        }
    }, [copied]);

    const handleChangeBundle = useCallback(
        (address, status) => {
            dispatch(changeBundle(address, status));
        },
        [dispatch],
    );

    const handleAddWatchedAddress = useCallback(() => {
        dispatch(addWatchAddress(address));
        setAddress('');
    }, [dispatch, address]);

    const handleDeleteAccount = useCallback(
        address => {
            dispatch(deleteAccount(address));
        },
        [dispatch],
    );

    const handleClearAccount = useCallback(() => {
        dispatch(clearAddresses());
    }, [dispatch]);

    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const openDeleteModal = useCallback(
        address => {
            setIsDeleteModalOpen(address);
        },
        [setIsDeleteModalOpen],
    );

    const openCreateLabelModal = useCallback(
        address => {
            setIsCreateLabelModalOpen(address);
        },
        [setIsCreateLabelModalOpen],
    );

    const handleChangeLabel = useCallback(
        (address, label) => {
            dispatch(changeLabel(address, label));
        },
        [dispatch],
    );

    const handleSelectActive = useCallback(
        (type, address) => {
            dispatch(changeActive(type, address));
        },
        [dispatch],
    );

    const handleActiveAddress = useCallback(() => {
        if (bundledAddresses?.length) {
            handleSelectActive('bundle', null);
            walletSelectorBtn.current?.click();
        }
    }, [handleSelectActive, bundledAddresses?.length]);

    const openExitModal = useCallback(() => {
        setIsExitModalOpen(true);
    }, []);

    const avatarComponent = useCallback(() => {
        return <Avatar size="24" address={selectAddress} key={selectAddress} />;
    }, [selectAddress]);

    const errorWithNonInput = address && !isAddress(address);
    const errorWithDupAccount = address && watchedAddresses.some(item => item.address === address);
    const error = errorWithNonInput || errorWithDupAccount;

    return (
        <>
            {/* Popover */}
            <Popover className="relative">
                {({ open }) => (
                    <>
                        {/* Popover Trigger Button */}
                        <Popover.Button
                            ref={walletSelectorBtn}
                            className={classNames(
                                'inline-flex items-center p-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:ring-offset-gray-900',
                                open
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50 focus:ring-0 focus:ring-transparent'
                                    : 'text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200',
                            )}
                        >
                            {selectType === 'bundle' ? (
                                <div className="flex items-center mr-1">
                                    <Badge type="primary">{bundledAddresses?.length ?? 0}</Badge>
                                    <span className="hidden ml-3 sm:inline-block">
                                        <FormattedMessage id="action__bundled_address" />
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center flex-1 mr-1 overflow-hidden">
                                    <div className="w-6 h-6">{avatarComponent()}</div>
                                    <span className="flex-1 hidden ml-3 font-mono truncate sm:inline-block">
                                        {selectAddress ? `${shortenAddress(selectAddress)}` : ''}
                                    </span>
                                </div>
                            )}
                            <Icon
                                className={classNames(
                                    'w-5 h-5 transition',
                                    open
                                        ? 'text-gray-500 -rotate-180 dark:text-gray-400'
                                        : 'text-gray-400 dark:text-gray-500',
                                )}
                                name="solid-chevron-down"
                            />
                        </Popover.Button>
                        {/* Popover Trigger Button End */}
                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Popover.Panel className="absolute z-10 w-64 mt-2 origin-top -translate-x-1/2 left-1/2 sm:origin-top-right sm:left-auto sm:translate-x-0 sm:-right-1">
                                <div className="overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/20">
                                    <div className="px-3 py-1 space-y-2 text-sm text-gray-700 divide-y divide-gray-200 dark:text-gray-200 dark:divide-gray-700">
                                        {/* Bundled Wallets */}
                                        <div
                                            onClick={handleActiveAddress}
                                            onKeyPress={handleActiveAddress}
                                            className={classNames(
                                                'flex items-center p-2 rounded-md -mx-2 cursor-pointer',
                                                selectType === 'bundle'
                                                    ? 'bg-gray-100 text-gray-900 font-medium dark:text-gray-50 dark:bg-gray-700'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                                            )}
                                            role="option"
                                            aria-selected="false"
                                            tabIndex="-1"
                                        >
                                            <Badge className="mr-3" type="primary">
                                                {bundledAddresses?.length}
                                            </Badge>
                                            <FormattedMessage id="action__bundled_address" />
                                        </div>
                                        {/* Bundled Wallets End */}
                                        {/* Watched Addresses */}
                                        {!!watchedAddresses?.length && (
                                            <ul className="pt-2 space-y-2">
                                                <li
                                                    key="watched"
                                                    className="pt-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                                >
                                                    <FormattedMessage id="form__watched_str" />
                                                </li>
                                                {watchedAddresses.map(account => {
                                                    return (
                                                        <li
                                                            key={account.address}
                                                            className={classNames(
                                                                'flex items-center justify-between p-2 rounded-md -mx-2 cursor-pointer',
                                                                selectAddress === account.address
                                                                    ? 'bg-gray-100 text-gray-900 font-medium dark:text-gray-50 dark:bg-gray-700'
                                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                                                            )}
                                                        >
                                                            <div
                                                                aria-selected
                                                                role="option"
                                                                tabIndex="-1"
                                                                className="flex items-center flex-1 mr-4 overflow-hidden focus:outline-none"
                                                                onKeyPress={() => {
                                                                    handleSelectActive(
                                                                        'single',
                                                                        account.address,
                                                                    );
                                                                    walletSelectorBtn.current?.click();
                                                                }}
                                                                onClick={() => {
                                                                    handleSelectActive(
                                                                        'single',
                                                                        account.address,
                                                                    );
                                                                    walletSelectorBtn.current?.click();
                                                                }}
                                                            >
                                                                <div className="w-5 h-5">
                                                                    <Avatar
                                                                        size="20"
                                                                        address={account.address}
                                                                    />
                                                                </div>
                                                                <span
                                                                    className={classNames(
                                                                        'flex-1 ml-3 truncate',
                                                                        {
                                                                            'font-mono': !account.label,
                                                                        },
                                                                    )}
                                                                >
                                                                    {account?.address
                                                                        ? account.label
                                                                            ? `${account.label}`
                                                                            : `${shortenAddress(
                                                                                  account.address,
                                                                              )}`
                                                                        : ''}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-shrink-0 -m-1 space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openCreateLabelModal(
                                                                            account.address,
                                                                        )
                                                                    }
                                                                    onKeyPress={() =>
                                                                        openCreateLabelModal(
                                                                            account.address,
                                                                        )
                                                                    }
                                                                    className="flex items-center p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-gray-500 dark:hover:text-gray-400 dark:ring-offset-gray-900"
                                                                    data-tip
                                                                    data-for="createLabel"
                                                                >
                                                                    <Icon
                                                                        className="w-5 h-5"
                                                                        name="solid-pencil"
                                                                    />
                                                                </button>
                                                                <CopyToClipboard
                                                                    text={account.address}
                                                                    onCopy={() => setCopied(true)}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        data-tip
                                                                        onClick={event => {
                                                                            event.stopPropagation();
                                                                        }}
                                                                        className="flex items-center p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-gray-500 dark:hover:text-gray-400 dark:ring-offset-gray-900"
                                                                        data-for="copyToClipboard"
                                                                    >
                                                                        <Icon
                                                                            className="w-5 h-5"
                                                                            name="solid-clipboard"
                                                                        />
                                                                    </button>
                                                                </CopyToClipboard>
                                                            </div>
                                                            {/* Tooltips */}
                                                            <Tooltip id="createLabel">
                                                                <span>
                                                                    <FormattedMessage id="action__create_label" />
                                                                </span>
                                                            </Tooltip>
                                                            <Tooltip
                                                                id="copyToClipboard"
                                                                width={100}
                                                            >
                                                                <div className="min-w-[120px] text-center">
                                                                    {copied
                                                                        ? intl.formatMessage({
                                                                              id: 'action__copied',
                                                                          })
                                                                        : intl.formatMessage({
                                                                              id:
                                                                                  'action__copy_to_clipboard',
                                                                          })}
                                                                </div>
                                                            </Tooltip>
                                                            {/* Tooltips End */}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                        {/* Watched Addresses End */}
                                        {/* Connected Address */}
                                        {!!connectedAddress && (
                                            <ul className="pt-2 space-y-2">
                                                <li className="pt-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    <FormattedMessage id="form__connected_str" />
                                                </li>
                                                <li
                                                    className={classNames(
                                                        'flex items-center justify-between p-2 rounded-md -mx-2 cursor-pointer',
                                                        selectType === 'connected'
                                                            ? 'bg-gray-100 text-gray-900 font-medium dark:text-gray-50 dark:bg-gray-700'
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                                                    )}
                                                >
                                                    <div
                                                        aria-selected
                                                        role="option"
                                                        tabIndex="-1"
                                                        className="flex items-center flex-1 mr-4 overflow-hidden focus:outline-none"
                                                        onClick={() => {
                                                            handleSelectActive('connected', null);
                                                            walletSelectorBtn.current?.click();
                                                        }}
                                                        onKeyPress={() => {
                                                            handleSelectActive('connected', null);
                                                            walletSelectorBtn.current?.click();
                                                        }}
                                                    >
                                                        <div className="w-5 h-5">
                                                            <Avatar
                                                                address={connectedAddress.address}
                                                                size="20"
                                                            />
                                                        </div>
                                                        {/* Note: remove the font-mono after created label */}
                                                        <span className="flex-1 ml-3 truncate">
                                                            {connectedAddress?.address
                                                                ? connectedAddress.label
                                                                    ? `${connectedAddress.label}`
                                                                    : `${shortenAddress(
                                                                          connectedAddress.address,
                                                                      )}`
                                                                : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-shrink-0 -m-1 space-x-2">
                                                        <CopyToClipboard
                                                            text={connectedAddress.address}
                                                            onCopy={() => setCopied(true)}
                                                        >
                                                            <button
                                                                type="button"
                                                                data-tip
                                                                onClick={event => {
                                                                    event.stopPropagation();
                                                                }}
                                                                className="flex items-center p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-gray-500 dark:hover:text-gray-400 dark:ring-offset-gray-900"
                                                                data-for="copyToClipboard"
                                                            >
                                                                <Icon
                                                                    className="w-5 h-5"
                                                                    name="solid-clipboard"
                                                                />
                                                            </button>
                                                        </CopyToClipboard>
                                                    </div>
                                                </li>
                                            </ul>
                                        )}
                                        {/* Connected Address End */}
                                        {/* Settings */}
                                        <ul className="pt-2 space-y-2" role="menu">
                                            <li
                                                aria-selected
                                                onClick={openModal}
                                                onKeyPress={openModal}
                                                className="flex items-center justify-between p-2 -mx-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
                                                role="option"
                                                tabIndex="-1"
                                            >
                                                <div className="flex items-center">
                                                    <Icon
                                                        name="solid-adjustments"
                                                        className="w-5 h-5 text-gray-400"
                                                    />
                                                    <span className="ml-3">
                                                        <FormattedMessage id="action__manage_address" />
                                                    </span>
                                                </div>
                                            </li>
                                            <li
                                                aria-selected
                                                onClick={openExitModal}
                                                onKeyPress={openExitModal}
                                                className="flex items-center justify-between p-2 -mx-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
                                                role="option"
                                                tabIndex="-1"
                                            >
                                                <div className="flex items-center">
                                                    <Icon
                                                        name="solid-logout"
                                                        className="w-5 h-5 text-gray-400"
                                                    />
                                                    <span className="ml-3">
                                                        <FormattedMessage id="action__exit" />
                                                    </span>
                                                </div>
                                            </li>
                                        </ul>
                                        {/* Settings End */}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
            {/* Popover End */}
            {/* Manage Address (Modals) */}
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 z-10 overflow-y-auto"
                    open={isOpen}
                    onClose={setIsOpen}
                    initialFocus={initialFocusInput}
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
                            <div className="inline-block w-full p-4 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-xl sm:my-8 sm:align-middle sm:max-w-[480px] sm:w-full sm:p-6 dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
                                {/* Modal Header */}
                                <div className="flex items-center px-4 py-3 mb-4 -mx-4 -mt-4 border-b border-gray-200 sm:mb-6 sm:px-6 sm:py-4 sm:-mt-6 sm:-mx-6 dark:border-gray-700">
                                    <Dialog.Title
                                        as="h3"
                                        className="flex-1 text-lg font-medium leading-6 text-gray-900 truncate dark:text-gray-50"
                                    >
                                        <FormattedMessage id="form__manage_address" />
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
                                    {/* Add addresses */}
                                    <div className="space-y-2 text-center sm:space-y-0 sm:space-x-2 sm:flex sm:items-start">
                                        {/* Start by typing address manually */}
                                        <div className="relative sm:flex-1">
                                            <div>
                                                {/* Address field */}
                                                <input
                                                    ref={initialFocusInput}
                                                    value={address}
                                                    onChange={e => setAddress(e.target.value)}
                                                    type="text"
                                                    className={classNames(
                                                        'block w-full pr-10 bg-gray-50 form-input sm:text-sm rounded-md dark:bg-black/50',
                                                        error
                                                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:text-red-300'
                                                            : 'text-gray-700 placeholder-gray-400 focus:ring-brand-500 focus:border-brand-500 border-gray-200 dark:border-gray-600 dark:placeholder-gray-500 dark:text-gray-200',
                                                    )}
                                                    placeholder={intl.formatMessage({
                                                        id: 'content__enter_ETH_BSC_HECO_address',
                                                    })}
                                                />
                                                {/* Error text */}
                                                {error && (
                                                    <p
                                                        className="mt-2 text-sm text-left text-red-600 dark:text-red-300"
                                                        id="email-error"
                                                    >
                                                        {errorWithDupAccount &&
                                                            intl.formatMessage({
                                                                id:
                                                                    'form__duplicate_watched_address',
                                                            })}
                                                        {errorWithNonInput &&
                                                            intl.formatMessage({
                                                                id:
                                                                    'form__incorrect_address_format',
                                                            })}
                                                    </p>
                                                )}
                                            </div>
                                            {/* Primary Button */}
                                            <div className="absolute top-1.5 right-1.5 sm:top-1 sm:right-1">
                                                <button
                                                    type="button"
                                                    disabled={error || !address}
                                                    onClick={handleAddWatchedAddress}
                                                    className="inline-flex items-center p-1 text-sm font-medium text-white border border-transparent rounded shadow-sm bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:ring-offset-gray-900 dark:bg-brand-600 dark:hover:bg-brand-500"
                                                >
                                                    <Icon
                                                        name="solid-plus-sm"
                                                        className="w-5 h-5"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        {!connectedAddress && (
                                            <>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 sm:pt-[9px]">
                                                    <FormattedMessage id="form__or" />
                                                </div>
                                                {/* Start by connecting wallet */}
                                                <ConnectionButton
                                                    trigger={
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-offset-gray-900"
                                                        >
                                                            <FormattedMessage id="action__connect_wallet" />
                                                        </button>
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                    {/* Add addresses End */}
                                    {/* Watched Address */}
                                    <div>
                                        <div className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            <FormattedMessage id="form__watched_str" /> (
                                            <span>{watchedAddresses.length}</span>)
                                        </div>
                                        {!!watchedAddresses.length && (
                                            <ul className="space-y-2 text-sm text-gray-700 divide-y divide-gray-200 dark:text-gray-200 dark:divide-gray-700">
                                                {watchedAddresses.map(account => {
                                                    return (
                                                        <li
                                                            className="flex items-center justify-between pt-2"
                                                            key={account.address}
                                                        >
                                                            <div className="flex items-center flex-1 mr-4 overflow-hidden">
                                                                <div className="w-5 h-5">
                                                                    <Avatar
                                                                        address={account.address}
                                                                        size="20"
                                                                    />
                                                                </div>
                                                                <span className="ml-3 font-mono truncate">
                                                                    {account?.address
                                                                        ? shortenAddress(
                                                                              account.address,
                                                                          )
                                                                        : '-'}
                                                                </span>
                                                                {!!account?.label && (
                                                                    <div className="hidden sm:flex">
                                                                        <Badge className="ml-3">
                                                                            {account.label}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center flex-shrink-0 space-x-4">
                                                                <div className="flex items-center">
                                                                    <span className="mr-2 text-gray-500 dark:text-gray-400">
                                                                        <FormattedMessage id="form__bundle" />
                                                                    </span>
                                                                    <Switch
                                                                        checked={account.bundle}
                                                                        onChange={val =>
                                                                            handleChangeBundle(
                                                                                account.address,
                                                                                val,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="flex items-center p-1 text-gray-300 rounded-full hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-gray-600 dark:hover:text-gray-400 dark:ring-offset-gray-900"
                                                                    onClick={() =>
                                                                        openDeleteModal(
                                                                            account.address,
                                                                        )
                                                                    }
                                                                >
                                                                    <Icon
                                                                        name="solid-trash"
                                                                        className="w-5 h-5"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                    {/* Watched Address */}
                                    {/* Connected Address */}
                                    {!!connectedAddress && (
                                        <div>
                                            <div className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                <FormattedMessage id="form__connected_str" />
                                            </div>
                                            <ul className="space-y-2 text-sm text-gray-700 divide-y divide-gray-200 dark:text-gray-200 dark:divide-gray-700">
                                                <li className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center flex-1 mr-4 overflow-hidden">
                                                        <div className="w-5 h-5">
                                                            <Avatar
                                                                address={connectedAddress.address}
                                                                size="20"
                                                            />
                                                        </div>
                                                        <span className="flex-1 ml-3 font-mono truncate">
                                                            {connectedAddress.address
                                                                ? shortenAddress(
                                                                      connectedAddress.address,
                                                                  )
                                                                : ''}
                                                            {connectedAddress.label
                                                                ? `(${connectedAddress.label})`
                                                                : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center flex-shrink-0 space-x-4">
                                                        <div className="flex items-center">
                                                            <span className="mr-2 text-gray-500 dark:text-gray-400">
                                                                <FormattedMessage id="form__bundle" />
                                                            </span>
                                                            <Switch
                                                                checked={connectedAddress.bundle}
                                                                onChange={val =>
                                                                    handleChangeBundle(
                                                                        connectedAddress.address,
                                                                        val,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="flex items-center p-1 text-gray-300 rounded-full hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-gray-600 dark:hover:text-gray-400 dark:ring-offset-gray-900"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    connectedAddress.address,
                                                                )
                                                            }
                                                            onKeyPress={() =>
                                                                openDeleteModal(
                                                                    connectedAddress.address,
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                name="solid-trash"
                                                                className="w-5 h-5"
                                                            />
                                                        </button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                    {/* Connected Address End */}
                                    {/* Address List End */}
                                    {/* Delete Address (Modal) */}
                                    <Transition.Root show={!!isDeleteModalOpen} as={Fragment}>
                                        <Dialog
                                            as="div"
                                            static
                                            className="fixed inset-0 z-10 overflow-y-auto"
                                            open={!!isDeleteModalOpen}
                                            onClose={setIsDeleteModalOpen}
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
                                                    <div className="inline-block w-full p-4 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-xl sm:my-8 sm:align-middle sm:max-w-[333px] sm:w-full sm:p-6 dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
                                                        {/* Modal Body */}
                                                        <div>
                                                            <div>
                                                                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-50 dark:bg-red-900">
                                                                    <Icon
                                                                        name="outline-trash"
                                                                        className="w-6 h-6 text-red-500 dark:text-red-300"
                                                                        aria-hidden="true"
                                                                    />
                                                                </div>
                                                                <div className="mt-3 text-center sm:mt-5">
                                                                    <Dialog.Title
                                                                        as="h3"
                                                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50"
                                                                    >
                                                                        <FormattedMessage id="form__delete_address" />
                                                                    </Dialog.Title>
                                                                    <div className="mt-2">
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                            <FormattedMessage id="form__address" />{' '}
                                                                            [
                                                                            {isDeleteModalOpen
                                                                                ? shortenAddress(
                                                                                      isDeleteModalOpen,
                                                                                  )
                                                                                : ''}
                                                                            ]{' '}
                                                                            <FormattedMessage id="form__address_will_be_removed" />
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex mt-5 space-x-4 sm:mt-6">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-offset-gray-900"
                                                                    onClick={() =>
                                                                        setIsDeleteModalOpen(false)
                                                                    }
                                                                >
                                                                    <FormattedMessage id="action__cancel" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-md shadow-sm bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-800 dark:ring-offset-gray-900"
                                                                    onClick={() => {
                                                                        handleDeleteAccount(
                                                                            isDeleteModalOpen,
                                                                        );
                                                                        setIsDeleteModalOpen(false);
                                                                    }}
                                                                >
                                                                    <FormattedMessage id="action__delete" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Transition.Child>
                                            </div>
                                        </Dialog>
                                    </Transition.Root>
                                    {/* Delete Address (Modal) End */}
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* Manage Address (Modal) End */}
            {/* Exit Modal */}
            <Transition.Root show={isExitModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 z-10 overflow-y-auto"
                    open={isExitModalOpen}
                    onClose={setIsExitModalOpen}
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
                            <div className="inline-block w-full p-4 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-xl sm:my-8 sm:align-middle sm:max-w-[333px] sm:w-full sm:p-6 dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
                                {/* Modal Body */}
                                <div>
                                    <div>
                                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-gray-50 dark:bg-gray-800">
                                            <Icon
                                                name="outline-logout"
                                                className="w-6 h-6 text-gray-500 translate-x-0.5 dark:text-gray-300"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50"
                                            >
                                                <FormattedMessage id="action__exit" />
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <FormattedMessage id="modal__this_will_remove_all_connected_and_watched_addresses_des" />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex mt-5 space-x-4 sm:mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-offset-gray-900"
                                            onClick={() => setIsExitModalOpen(false)}
                                        >
                                            <FormattedMessage id="action__cancel" />
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium border rounded-md shadow-sm text-brand-600 border-brand-300 bg-brand-50 hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-brand-900 dark:border-brand-700 dark:text-brand-200 dark:hover:bg-brand-800 dark:ring-offset-gray-900"
                                            onClick={() => {
                                                handleClearAccount();
                                                setIsExitModalOpen(false);
                                            }}
                                        >
                                            <FormattedMessage id="action__exit" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* Exit Modal End */}
            {/* CreateLabel Modal */}
            <Transition.Root show={!!isCreateLabelModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 z-10 overflow-y-auto"
                    open={!!isCreateLabelModalOpen}
                    onClose={setIsCreateLabelModalOpen}
                    initialFocus={labelInput}
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
                            <div className="inline-block w-full p-4 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl rounded-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
                                {/* Modal Body */}
                                <div>
                                    <div>
                                        {/* Address field */}
                                        <label
                                            htmlFor="label"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <FormattedMessage id="form__label" />
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                ref={labelInput}
                                                name="label"
                                                defaultValue={labelModalActiveAccount?.label}
                                                type="text"
                                                className={classNames(
                                                    'block w-full pr-10 bg-gray-50 form-input sm:text-sm rounded-md dark:bg-black/50',
                                                    error
                                                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:text-red-300'
                                                        : 'text-gray-700 placeholder-gray-400 focus:ring-brand-500 focus:border-brand-500 border-gray-200 dark:border-gray-600 dark:placeholder-gray-500 dark:text-gray-200',
                                                )}
                                                placeholder={intl.formatMessage({
                                                    id: 'form__enter_new_label',
                                                })}
                                            />
                                            {/* Error text */}
                                            {error && (
                                                <p
                                                    className="mt-2 text-sm text-left text-red-600 dark:text-red-300"
                                                    id="email-error"
                                                >
                                                    Incorrect label format.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex mt-5 space-x-4 sm:mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-offset-gray-900"
                                            onClick={() => setIsCreateLabelModalOpen(false)}
                                        >
                                            <FormattedMessage id="action__cancel" />
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:ring-offset-gray-900 dark:bg-brand-600 dark:hover:bg-brand-500"
                                            onClick={() => {
                                                handleChangeLabel(
                                                    isCreateLabelModalOpen,
                                                    labelInput?.current?.value,
                                                );
                                                setIsCreateLabelModalOpen(false);
                                            }}
                                        >
                                            <FormattedMessage id="action__create_label" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* CreateLabel Modal End */}
        </>
    );
}
