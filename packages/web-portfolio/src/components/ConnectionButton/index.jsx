import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import { FormattedMessage } from 'react-intl';

import { connectAddress } from '@store/actions';
import { useConnectionModal, useActiveWeb3React } from '@components/Connection/hooks/connect';

const CrowdfundConnectWallet = ({ trigger }) => {
    const dispatch = useDispatch();
    const { account, error } = useActiveWeb3React();
    const { handleOpen: handleConnect } = useConnectionModal();
    const handleOpen = useCallback(() => {
        if (account) {
            dispatch(connectAddress(account));
        } else {
            handleConnect();
        }
    }, [dispatch, account, handleConnect]);

    if (error) {
        if (error instanceof UserRejectedRequestError) {
            return (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handleOpen}
                    onKeyPress={handleOpen}
                    className="cursor-pointer flex items-center px-4 py-2 space-x-4 border border-red-400 rounded-lg"
                >
                    <p className="text-red-400">
                        <FormattedMessage
                            id="error__connect__reject"
                            defaultMessage="连接出现了错误"
                        />
                    </p>
                </div>
            );
        }

        if (error.message.search('already pending for origin') > -1) {
            return (
                <div className="flex items-center px-4 py-2 space-x-4 border border-red-400 rounded-lg">
                    <p className="text-red-400">
                        <FormattedMessage
                            id="error__connect__pending"
                            defaultMessage="已经发起了连接请求，请检查连接的对象"
                        />
                    </p>

                    <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                        onClick={handleOpen}
                    >
                        <FormattedMessage
                            id="crowdfund__connect_wallet__retry"
                            defaultMessage="点击重试"
                        />
                    </button>
                </div>
            );
        }
    }

    return (
        <div role="button" tabIndex={0} onClick={handleOpen} onKeyPress={handleOpen}>
            {trigger || (
                <button
                    type="button"
                    className={classNames(
                        'inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm leading-4 font-normal rounded-md',
                        'bg-green-nft-500 hover:bg-green-nft-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-nft-500',
                    )}
                >
                    <FormattedMessage
                        id="crowdfund__connect_wallet"
                        defaultMessage="Connect to wallet"
                    />
                </button>
            )}
        </div>
    );
};

export default CrowdfundConnectWallet;
