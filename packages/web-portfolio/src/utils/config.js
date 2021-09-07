import { NetworkConnector } from '@web3-react/network-connector';
import { InjectedConnector } from '@web3-react/injected-connector';

export const network = new NetworkConnector({
    defaultChainId: 1,
    urls: {
        1: 'https://rpc.blkdb.cn/eth',
        42: 'https://kovan.infura.io/v3/5efe0993c3184b9492427eae060b680b',
        56: 'https://rpc.blkdb.cn/bsc',
        128: 'https://rpc.blkdb.cn/heco',
    },
});

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 42, 56, 128, 137],
});

export const CACHE_KEY = '__PORTFOLIO__ACCOUNTS__';
export const ACTIVE_CACHE_KEY = '__PORTFOLIO__ACTIVE__ONEKEY__';

export const chains = [
    {
        id: 0,
        name: 'All Chains',
        translationId: 'action__all_chains',
        chain: null,
        alt: 'ALL',
    },
    {
        id: 1,
        name: 'Ethereum',
        chain: 'eth',
        icon: '/chain/ETH.svg',
        alt: 'Ethereum',
    },
    {
        id: 2,
        name: 'BSC',
        chain: 'bsc',
        icon: '/chain/BSC.svg',
        alt: 'BSC',
    },
    {
        id: 3,
        name: 'HECO',
        chain: 'heco',
        icon: '/chain/HECO.svg',
        alt: 'HECO',
    },
    {
        id: 4,
        name: 'Polygon',
        chain: 'matic',
        icon: '/chain/Polygon.svg',
        alt: 'Polygon',
    },
];

export const locales = [
    {
        id: 0,
        default: true,
        name: '简体中文',
        locale: 'zh-CN',
    },
    {
        id: 1,
        name: 'English',
        locale: 'en-US',
    },
];
