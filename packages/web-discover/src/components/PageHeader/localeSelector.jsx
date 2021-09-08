import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useLocale } from '@onekeyhq/ui-components';
import Icon from '@components/Icon';
import Image from '@components/Image';

import { locales } from '@utils/config';

export default function LocaleSelector() {
    const { setLocale, locale } = useLocale();
    const intl = useIntl();
    const [selected, setSelected] = useState(locale);

    useEffect(() => {
        const target = locales.find(l => l.locale === locale);
        setSelected(target);
    }, [locale, setLocale]);

    const handleActiveChain = useCallback(
        config => {
            setLocale(config.locale);
        },
        [setLocale],
    );

    return (
        <Listbox
            value={selected}
            onChange={locale => {
                handleActiveChain(locale);
                setSelected(locale);
            }}
        >
            {({ open }) => (
                <div className="relative">
                    <Listbox.Button
                        className={classNames(
                            'inline-flex items-center p-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:ring-offset-gray-900 justify-center',
                            open
                                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
                                : 'text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200',
                        )}
                    >
                        <span className="flex items-center mr-1">
                            {!!selected.icon && (
                                <Image
                                    src={selected.icon}
                                    alt={selected.alt}
                                    className="flex-shrink-0 w-6 h-6 mr-3 rounded-full"
                                />
                            )}
                            <span className="block truncate">
                                {selected.translationId
                                    ? intl.formatMessage({ id: selected.translationId })
                                    : selected.name}
                            </span>
                        </span>
                        <Icon
                            className={classNames(
                                'w-5 h-5 transition',
                                open
                                    ? 'text-gray-500 -rotate-180 dark:text-gray-400'
                                    : 'text-gray-400 dark:text-gray-500',
                            )}
                            name="solid-chevron-down"
                        />
                    </Listbox.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Listbox.Options
                            static
                            className="absolute right-0 z-10 p-1 py-1 mt-1 space-y-1 overflow-auto text-sm text-gray-700 origin-top-right bg-white rounded-md shadow-lg w-52 max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-900 dark:ring-white/20 dark:text-gray-200"
                        >
                            {locales.map(locale => (
                                <Listbox.Option
                                    key={locale.id}
                                    className={({ active }) =>
                                        classNames(
                                            active
                                                ? 'bg-gray-100 text-gray-900 font-medium dark:text-gray-50 dark:bg-gray-700'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                                            'flex items-center justify-between p-2 rounded-md cursor-pointer select-none',
                                        )
                                    }
                                    value={locale}
                                >
                                    {({ selected, active }) => (
                                        <div className="flex items-center">
                                            {!!locale.icon && (
                                                <Image
                                                    src={locale.icon}
                                                    alt={locale.alt}
                                                    className="flex-shrink-0 w-6 h-6 mr-3 rounded-full"
                                                />
                                            )}
                                            <span
                                                className={classNames(
                                                    selected ? 'font-semibold' : 'font-normal',
                                                    'block truncate',
                                                )}
                                            >
                                                {locale.translationId
                                                    ? intl.formatMessage({
                                                          id: locale.translationId,
                                                      })
                                                    : locale.name}
                                            </span>
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}
