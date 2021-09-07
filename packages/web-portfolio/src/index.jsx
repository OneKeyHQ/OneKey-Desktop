import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Provider } from 'react-redux';
import { UIProvider } from '@onekeyhq/ui-components';

import locales from './locales';

import Home from './layout/Home';

import APIUpdater from './components/APIUpdater';
import ConnectionModalProvider from './components/Connection/Provider';
import { NetworkContextName } from './components/Connection/hooks/connect';
import Web3ReactManager from '@components/Web3ReactManager';

import store from './store';

import '@onekeyhq/ui-components/index.css';
import './index.css';

const getLibrary = provider => {
    return new Web3Provider(provider);
};
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <UIProvider messagesMap={locales}>
                <APIUpdater>
                    <Web3ReactProvider getLibrary={getLibrary}>
                        <Web3ProviderNetwork getLibrary={getLibrary}>
                            <Web3ReactManager>
                                <ConnectionModalProvider>
                                    <Home />
                                </ConnectionModalProvider>
                            </Web3ReactManager>
                        </Web3ProviderNetwork>
                    </Web3ReactProvider>
                </APIUpdater>
            </UIProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);
