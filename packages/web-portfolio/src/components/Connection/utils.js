import { getAddress } from '@ethersproject/address';

const ChainId = {
    MAINNET: 1,
    ROPSTEN: 3,
    RINKEBY: 4,
    GÖRLI: 5,
    KOVAN: 42,
    BSC: 56,
    HECO: 128,
    POLYGON: 137,
};

const ETHERSCAN_PREFIXES = {
    1: '',
    3: 'ropsten.',
    4: 'rinkeby.',
    5: 'goerli.',
    42: 'kovan.',
    56: '',
    128: '',
    137: '',
};

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
    const parsed = isAddress(address);
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function getEtherscanLink(chainId, data, type) {
    let prefix = '';
    if (chainId === ChainId.BSC) {
        prefix = 'https://bscscan.com';
    } else if (chainId === ChainId.HECO) {
        prefix = 'https://hecoinfo.com';
    } else if (chainId === ChainId.POLYGON) {
        prefix = 'https://polygonscan.com';
    } else {
        prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;
    }

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`;
        }
        case 'token': {
            return `${prefix}/token/${data}`;
        }
        case 'block': {
            return `${prefix}/block/${data}`;
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`;
        }
    }
}
