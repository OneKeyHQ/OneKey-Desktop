import {
    ADD_WATCH_ADDRESS,
    CONNECT_ADDRESS,
    DISCONNECT_ADDRESS,
    CLEAR_ADDRESSES,
    CHANGE_LABEL,
    CHANGE_BUNDLE,
    DELETE_ACCOUNT,
} from '../actions';

import { CACHE_KEY } from '@utils/config';

function loadDefaultStorageData() {
    if (!localStorage) return;

    const str = localStorage?.getItem(CACHE_KEY);

    if (!str) return;
    return JSON.parse(str);
}

const INIT_STORE = loadDefaultStorageData() ?? [];

export default (store = INIT_STORE, action) => {
    if (action.type === ADD_WATCH_ADDRESS) {
        return [
            ...store,
            {
                bundle: false,
                type: 'watched',
                label: '',
                address: action.payload,
            },
        ];
    }

    if (action.type === CONNECT_ADDRESS) {
        const findPreviousConnect = store.findIndex(item => item.type === 'connected');
        if (findPreviousConnect >= 0) {
            return [
                ...store.slice(0, findPreviousConnect),
                {
                    type: 'connected',
                    bundle: false,
                    label: '',
                    address: action.payload,
                },
                ...store.slice(findPreviousConnect + 1),
            ];
        }
        return [
            ...store,
            {
                type: 'connected',
                bundle: false,
                label: '',
                address: action.payload,
            },
        ];
    }

    if (action.type === DISCONNECT_ADDRESS) {
        const findPreviousConnect = store.findIndex(item => item.type === 'connected');
        if (findPreviousConnect >= 0) {
            return [
                ...store.slice(0, findPreviousConnect),
                ...store.slice(findPreviousConnect + 1),
            ];
        }
        return store;
    }

    if (action.type === DELETE_ACCOUNT) {
        const findPreviousConnect = store.findIndex(
            item => item.address === action.payload.address,
        );
        if (findPreviousConnect >= 0) {
            return [
                ...store.slice(0, findPreviousConnect),
                ...store.slice(findPreviousConnect + 1),
            ];
        }
        return store;
    }

    if (action.type === CLEAR_ADDRESSES) {
        return [];
    }

    if (action.type === CHANGE_BUNDLE) {
        const { address, bundle } = action.payload;
        const findPreviousConnect = store.findIndex(item => item.address === address);
        const item = store[findPreviousConnect];
        if (findPreviousConnect >= 0) {
            return [
                ...store.slice(0, findPreviousConnect),
                {
                    ...item,
                    bundle,
                },
                ...store.slice(findPreviousConnect + 1),
            ];
        }
        return store;
    }

    if (action.type === CHANGE_LABEL) {
        const { address, label } = action.payload;
        const findPreviousConnect = store.findIndex(item => item.address === address);
        const item = store[findPreviousConnect];
        if (findPreviousConnect >= 0) {
            return [
                ...store.slice(0, findPreviousConnect),
                {
                    ...item,
                    label,
                },
                ...store.slice(findPreviousConnect + 1),
            ];
        }
        return store;
    }

    return store;
};
