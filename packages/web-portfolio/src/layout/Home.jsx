import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useSelector, useDispatch } from 'react-redux';
import { Sidebar } from '@onekeyhq/ui-components';

import { connectAddress, disconnectAddress } from '../store/actions';

import Index from '.';
import Overview from './Overview';
import Platform from './Platform';

const SubChildren = () => {
    const dispatch = useDispatch();
    const { account: connectedAccount } = useWeb3React();
    const accounts = useSelector(s => s.device);
    const activePlatform = useSelector(s => s.active.platform);

    useEffect(() => {
        if (connectedAccount) {
            dispatch(connectAddress(connectedAccount));
        } else {
            dispatch(disconnectAddress(connectedAccount));
        }
    }, [connectedAccount, dispatch]);

    if (activePlatform) return <Platform />;
    if (accounts.length) return <Overview />;

    return <Index />;
};

const Home = () => {
    return (
        <div className="flex flex-col h-full lg:flex-row">
            <SubChildren />
        </div>
    );
};

export default Home;
