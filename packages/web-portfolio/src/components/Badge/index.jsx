import React from 'react';
import classNames from 'classnames';

export default function Badge(props) {
    const { className, children = 'Badge', type = 'default', ...rest } = props;

    const badgeClass = classNames('inline-block font-medium text-xs py-0.5 px-1.5 rounded', {
        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300': type === 'default',
        'bg-brand-500 text-white dark:bg-brand-300 dark:text-brand-900': type === 'primary',
        'bg-red-500 text-white dark:bg-red-300 dark:text-red-900': type === 'important',
        'bg-brand-100 text-brand-600 dark:bg-brand-800 dark:text-brand-200': type === 'added',
        'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200': type === 'removed',
    });

    return (
        <div className={`${badgeClass} ${className}`} {...rest}>
            {children}
        </div>
    );
}
