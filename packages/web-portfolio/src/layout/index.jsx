import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';

import { addWatchAddress } from '@store/actions';
import ConnectionButton from '@components/ConnectionButton';
import Image from '@components/Image';
import { isAddress } from '@components/Connection/utils';

const Form = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [address, setAddress] = useState('');
    const watchedAddress = useSelector(
        s => s.devices?.map?.(item => item.type === 'watched') ?? [],
    );
    const handleAddWatchedAddress = useCallback(() => {
        dispatch(addWatchAddress(address));
    }, [dispatch, address]);

    const errorWithNonInput = address && !isAddress(address);
    const errorWithDupAccount = address && watchedAddress.some(item => item.address === address);
    const error = errorWithNonInput || errorWithDupAccount;

    return (
        <div className="flex justify-center flex-1 overflow-y-auto text-center lg:h-full sm:items-center">
            <div className="w-[608px] max-w-full px-4 py-8 sm:-translate-y-12">
                {/* Illustration */}
                <div className="w-full overflow-x-hidden">
                    <div className="translate-x-8">
                        <Image
                            width="270px"
                            height="259px"
                            src="/illus/illus-portfolio.png"
                            className="w-48 h-[184px] sm:w-[270px] sm:h-[259px]"
                        />
                    </div>
                </div>
                {/* Headline */}
                <h1 className="mt-4 mb-8 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-50">
                    <FormattedMessage id="form__manage_your_defi_assets_on_multi_chain" />
                </h1>
                {/* Form Controls */}
                <div className="space-y-4">
                    {/* Start by typing address manually */}
                    <div className="relative">
                        {/* Address field */}
                        <input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            type="text"
                            className={classNames(
                                'block w-full py-[15px] pl-4 pr-[100px] bg-gray-50 form-input rounded-lg dark:bg-black/50',
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
                                className="mt-2 text-sm text-red-600 dark:text-red-300"
                                id="email-error"
                            >
                                {errorWithNonInput &&
                                    intl.formatMessage({
                                        id: 'form__incorrect_address_format',
                                    })}
                                {errorWithDupAccount &&
                                    intl.formatMessage({
                                        id: 'form__duplicate_watched_address',
                                    })}
                            </p>
                        )}
                        {/* Primary Button */}
                        <div className="absolute top-[9px] right-[9px]">
                            <button
                                onClick={handleAddWatchedAddress}
                                type="button"
                                disabled={error || !address}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:ring-offset-gray-900 dark:bg-brand-600 dark:hover:bg-brand-500"
                            >
                                <FormattedMessage id="form__let_us_go" />
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <FormattedMessage id="form__or" />
                    </div>
                    {/* Start by connecting wallet */}
                    <ConnectionButton
                        trigger={
                            <button
                                type="button"
                                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-offset-gray-900"
                            >
                                <FormattedMessage id="action__connect_wallet" />
                            </button>
                        }
                    />
                </div>
                {/* Form Controls End */}
            </div>
        </div>
    );
};

export default Form;
