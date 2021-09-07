import React from 'react';
import Icon from '@components/Icon';
import Stats from '@components/Stats';
import Image from '@components/Image';
import Avatar from '@components/Avatar';

export default function StatsCard(props) {
    const {
        label = 'label',
        amount = 'Amount',
        imgSrc,
        address,
        type = 'wallet',
        icon,
        chainType,
        ...rest
    } = props;

    return (
        <div className="relative flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer dark:bg-gray-800 dark:border-gray-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 group">
            <div className="flex items-center flex-1">
                <div className="relative flex flex-shrink-0 mr-4">
                    <div className="inline-flex overflow-hidden rounded-full">
                        {address ? (
                            <Avatar address={address} size="40" />
                        ) : (
                            <Image src={imgSrc} width="40" height="40" />
                        )}
                    </div>
                    {chainType && (
                        <div className="absolute flex -top-2 -right-2">
                            <div className="inline-flex overflow-hidden border border-2 border-white rounded-full dark:border-gray-800">
                                <Image src={`/chain/${chainType}.svg`} width="20px" height="20px" />
                            </div>
                            {/* Placeholder when returning nothing */}
                            {/* <Icon name="solid-question-mark-circle" className="w-5 h-5 text-gray-300 bg-white rounded-full dark:text-gray-400 dark:bg-gray-800 mr-0.5 mt-0.5" /> */}
                        </div>
                    )}
                </div>
                <Stats label={label} amount={amount} className="flex-1" type={type} />
            </div>
            <div className="flex flex-shrink-0">
                {/* <Link href={href}> */}
                <button type="button" className="inline-flex focus:outline-none" {...rest}>
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    <Icon
                        name={icon}
                        className="w-6 h-6 text-gray-300 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                    />
                </button>
                {/* </Link> */}
            </div>
        </div>
    );
}
