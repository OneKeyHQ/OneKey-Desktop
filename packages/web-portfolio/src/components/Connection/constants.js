import { injected, walletconnect, walletlink } from './hooks/connect';

import Logo from './images/onekeyWithMetamask.svg';
import CoinbaseWalletIcon from './images/coinbaseWalletIcon.svg';
import WalletConnectIcon from './images/walletConnectIcon.svg';

export const KEY_DEVICE_TYPE = '__DEVICE_TYPE__';
export const KEY_ACCEPT_COOKIE = '__ACCEPT_COOKIE__';

export const ETHERSCAN_PREFIXES = {
    42: 'kovan.',
    56: '',
    31337: '',
};

export const FEE_RECIPIENT = '0xc1e92BD5d1aa6e5f5F299D0490BefD9D8E5a887a';
export const AFFILIATE_ADDRESS = '0x4F5FC02bE49Bea15229041b87908148b04c14717';

// TODO: check icon name
export const SUPPORTED_WALLETS = {
    INJECTED: {
        connector: injected,
        name: 'Injected',
        iconName: 'onekey.svg',
        description: 'Injected web3 provider.',
        href: null,
        color: '#010101',
        primary: true,
        mobile: true,
    },
    METAMASK: {
        connector: injected,
        name: 'OneKey',
        iconName: Logo,
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D',
    },
    WALLET_CONNECT: {
        connector: walletconnect,
        name: 'WalletConnect',
        iconName: WalletConnectIcon,
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
        mobile: true,
    },
    WALLET_LINK: {
        connector: walletlink,
        name: 'Coinbase Wallet',
        iconName: CoinbaseWalletIcon,
        description: 'Use Coinbase Wallet app on mobile device',
        href: null,
        color: '#315CF5',
    },
    COINBASE_LINK: {
        name: 'Open in Coinbase Wallet',
        iconName: CoinbaseWalletIcon,
        description: 'Open in Coinbase Wallet app.',
        href: 'https://go.cb-w.com/mtUDhEZPy1',
        color: '#315CF5',
        mobile: true,
        mobileOnly: true,
    },
};
