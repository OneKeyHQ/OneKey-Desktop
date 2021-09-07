import React from 'react';
import Icon from '@components/Icon';
import AddressSelector from './addressSelector';
import NetworkSelector from './networkSelector';
import LocaleSelector from './localeSelector';

export default function pageHeader(props) {
    const { className, pageTitle = 'Page Title', back, ...rest } = props;

    return (
        <header
            className={`border-b border-gray-200 flex-shrink-0 dark:border-gray-700 ${className}`}
            {...rest}
        >
            <div className="p-4 lg:px-8">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    {/* Title & Back Button */}
                    <div className="flex items-center flex-1">
                        {back && (
                            <div
                                role="button"
                                tabIndex={0}
                                className="mr-3 -ml-2 cursor-pointer"
                                onKeyPress={back}
                                onClick={back}
                            >
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center p-2 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:text-gray-500 dark:hover:text-gray-400 dark:ring-offset-gray-900"
                                >
                                    <Icon className="w-5 h-5" name="solid-arrow-left" />
                                </button>
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                                {pageTitle}
                            </h1>
                        </div>
                    </div>
                    {!back && (
                        <div className="flex items-center flex-shrink-0 ml-4 -mx-2 space-x-2">
                            <AddressSelector />
                            <NetworkSelector />
                            <LocaleSelector />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
