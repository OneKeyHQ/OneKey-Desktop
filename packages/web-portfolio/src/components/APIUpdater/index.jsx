/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { updatePayload, changeActive } from '@store/actions/';
import request from '@utils/request';

import APIContext from './context';

let cancelToken;

const APIUpdater = ({ children }) => {
    const dispatch = useDispatch();
    const addresses = useSelector(s => s.device);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.$ONEKEY_SETTINGS_THEME) {
            if (window.$ONEKEY_SETTINGS_THEME === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const { watchedAddresses, connectedAddress, bundledAddresses } = useMemo(() => {
        return {
            watchedAddresses: addresses.filter(account => account.type === 'watched') ?? [],
            connectedAddress: addresses.find(account => account.type === 'connected'),
            bundledAddresses: addresses.filter(account => !!account.bundle),
        };
    }, [addresses]);

    const { activeType, address } = useSelector(s => s.active.account);

    useEffect(() => {
        const fallbackPayload = connectedAddress?.address
            ? { activeType: 'connected' }
            : { activeType: 'single', address: watchedAddresses?.[0]?.address };

        if (activeType === 'bundle' && !bundledAddresses?.length) {
            dispatch(changeActive(fallbackPayload.activeType, fallbackPayload.address));
        }

        if (activeType === 'connected' && !connectedAddress?.address) {
            dispatch(changeActive(fallbackPayload.activeType, fallbackPayload.address));
        }

        if (activeType === 'single' && !watchedAddresses.some(item => item.address === address)) {
            dispatch(changeActive(fallbackPayload.activeType, fallbackPayload.address));
        }
        if (!activeType) {
            dispatch(changeActive(fallbackPayload.activeType, fallbackPayload.address));
        }
    }, [
        activeType,
        address,
        bundledAddresses,
        connectedAddress?.address,
        watchedAddresses,
        dispatch,
    ]);
    const selectAddress =
        activeType === 'single'
            ? address
            : activeType === 'connected'
            ? connectedAddress?.address
            : watchedAddresses?.[0]?.address;
    const selectChain = useSelector(s => s.active.chain);

    const activeAddresses = useMemo(() => {
        if (activeType === 'bundle') {
            return bundledAddresses.map(account => account.address).join(',');
        }

        return selectAddress;
    }, [activeType, selectAddress, bundledAddresses]);

    const handleRequest = useCallback(async () => {
        if (activeAddresses) {
            if (typeof cancelToken !== typeof undefined) {
                cancelToken.cancel('Operation canceled due to new request.');
            }

            cancelToken = axios.CancelToken.source();

            setIsFetching(true);
            try {
                const { portfolios } = await request(
                    `/v1/portfolios?address=${activeAddresses}${
                        selectChain ? `&chains=${selectChain}` : ''
                    }`,
                    { cancelToken: cancelToken.token },
                );
                dispatch(updatePayload(portfolios));
            } catch (e) {
                console.log('request failed', e);
            } finally {
                setIsFetching(false);
            }
        }
    }, [activeAddresses, dispatch, selectChain]);

    useEffect(() => {
        handleRequest();
    }, [handleRequest]);

    const providerValue = useMemo(() => {
        return {
            handleRequest,
            isFetching,
        };
    }, [handleRequest, isFetching]);

    return <APIContext.Provider value={providerValue}>{children}</APIContext.Provider>;
};

export default APIUpdater;
