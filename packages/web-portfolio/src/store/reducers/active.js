import { ACTIVE_CACHE_KEY } from '@utils/config';
import {
    CHANGE_ACTIVE,
    CHANGE_ACTIVE_PLATFORM,
    SET_ACTIVE_CHAIN,
    DELETE_ACCOUNT,
    CLEAR_ADDRESSES,
} from '../actions';

function loadDefaultStorageData() {
    if (!localStorage) return;

    const str = localStorage?.getItem(ACTIVE_CACHE_KEY);

    if (!str) return;
    return JSON.parse(str);
}

const INIT_STORE = loadDefaultStorageData() ?? {
    account: {
        type: '',
        address: null,
    },
    platform: '',
    chain: null,
};

export default (store = INIT_STORE, action) => {
    if (action.type === CHANGE_ACTIVE) {
        return {
            ...store,
            account: action.payload,
        };
    }

    if (action.type === CLEAR_ADDRESSES) {
        return {
            account: {
                type: '',
                address: null,
            },
            platform: '',
            chain: null,
        };
    }

    if (action.type === CHANGE_ACTIVE_PLATFORM) {
        return {
            ...store,
            platform: action.payload,
        };
    }

    if (action.type === DELETE_ACCOUNT) {
        const { account } = store;

        if (account.address === action.payload.address) {
            return {
                ...store,
                account: {
                    type: '',
                    address: null,
                },
            };
        }
        return store;
    }

    if (action.type === SET_ACTIVE_CHAIN) {
        return {
            ...store,
            chain: action.payload,
        };
    }

    return store;
};
