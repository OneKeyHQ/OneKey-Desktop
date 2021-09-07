/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
import React from 'react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import { isNil } from 'lodash';

import Icon from '@components/Icon';

export default function Stats(props) {
    const {
        label,
        amount,
        size = 'default',
        positive,
        className,
        type,
        dataTip,
        dataFor,
        prefix = '$',
        suffix,
        ...rest
    } = props;

    return (
        <div className={className} {...rest}>
            <div className="flex items-center mb-1">
                <div
                    className={classNames(
                        'font-medium text-gray-500 dark:text-gray-400 text-sm mr-1',
                        { 'font-mono': type === 'wallet' },
                    )}
                >
                    {label}
                </div>
                {dataFor && dataTip && (
                    <Icon
                        data-for={dataFor}
                        data-tip={dataTip}
                        className="w-[18px] h-[18px] text-gray-300 dark:text-gray-500"
                        name="solid-question-mark-circle"
                    />
                )}
            </div>
            {/* <div
        className={classNames("text-gray-900 dark:text-gray-50", {
          "text-2xl sm:text-3xl font-semibold": size === "lg",
          "text-lg font-medium": size === "default",
          "text-base font-medium sm:text-lg": size === "sm",
          "text-green-600 dark:text-green-500": positive,
        })}
      >
        {amount != undefined ? `$${new BigNumber(amount).toFixed(2)}` : "-"}
      </div> */}
            {!isNil(amount) ? (
                <div
                    className={classNames('text-gray-900 dark:text-gray-50', {
                        'text-2xl sm:text-3xl font-semibold': size === 'lg',
                        'text-lg font-medium': size === 'default',
                        'text-base font-medium sm:text-lg': size === 'sm',
                        'text-green-600 dark:text-green-500': positive,
                    })}
                >
                    {prefix || ''}
                    {type === 'percent'
                        ? new BigNumber(amount).multipliedBy(new BigNumber(100)).toFixed(2)
                        : new BigNumber(amount).toFixed(2)}
                    {suffix || ''}
                </div>
            ) : size === 'default' || size === 'sm' ? (
                <div className="w-32 h-5 mt-2 mb-1 bg-gray-300 rounded-full animate-pulse dark:bg-gray-600" />
            ) : (
                <div className="w-64 mt-3 bg-gray-300 rounded-full h-7 animate-pulse dark:bg-gray-600" />
            )}
        </div>
    );
}
