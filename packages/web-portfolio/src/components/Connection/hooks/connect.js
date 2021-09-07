import { useEffect, useMemo, useState, useContext } from 'react';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';

import { isMobile } from 'react-device-detect';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { ConnectionModalContext } from '../context';

export const NetworkContextName = 'NETWORK';

export const injected = new InjectedConnector();

// mainnet only
export const walletconnect = new WalletConnectConnector({
    rpc: {
        1: 'https://rpc.blkdb.cn/eth',
        42: 'https://kovan.infura.io/v3/5efe0993c3184b9492427eae060b680b',
        56: 'https://rpc.blkdb.cn/bsc',
        128: 'https://rpc.blkdb.cn/heco',
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 15000,
});

// mainnet only
export const walletlink = new WalletLinkConnector({
    rpc: {
        1: 'https://rpc.blkdb.cn/eth',
        42: 'https://kovan.infura.io/v3/5efe0993c3184b9492427eae060b680b',
        56: 'https://rpc.blkdb.cn/bsc',
        128: 'https://rpc.blkdb.cn/heco',
    },
    appName: 'Uniswap',
    appLogoUrl:
        'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
});

export function useActiveWeb3React() {
    const context = useWeb3ReactCore();
    const contextNetwork = useWeb3ReactCore(NetworkContextName);
    return context.active ? context : contextNetwork;
}

export function useEagerConnect() {
    const { activate, active } = useWeb3ReactCore(); // specifically using useWeb3ReactCore because of what this hook does
    const [tried, setTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then(isAuthorized => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else if (isMobile && window.ethereum) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (active) {
            setTried(true);
        }
    }, [active]);

    return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network they re on
 */
export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

    useEffect(() => {
        const { ethereum } = window;

        if (ethereum?.on && !active && !error && !suppress) {
            const handleChainChanged = () => {
                // eat errors
                activate(injected, undefined, true).catch(error => {
                    console.error('Failed to activate after chain changed', error);
                });
            };

            const handleAccountsChanged = accounts => {
                if (accounts.length > 0) {
                    // eat errors
                    activate(injected, undefined, true).catch(error => {
                        console.error('Failed to activate after accounts changed', error);
                    });
                }
            };

            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('chainChanged', handleChainChanged);
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                }
            };
        }
        return undefined;
    }, [active, error, suppress, activate]);
}

export function useConnectionModal() {
    return useContext(ConnectionModalContext);
}
