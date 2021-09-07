export const ADD_WATCH_ADDRESS = 'ADD_WATCH_ADDRESS';
export const CONNECT_ADDRESS = 'CONNECT_ADDRESS';
export const DISCONNECT_ADDRESS = 'DISCONNECT_ADDRESS';
export const CLEAR_ADDRESSES = 'CLEAR_ADDRESSES';
export const CHANGE_LABEL = 'CHANGE_LABEL';
export const CHANGE_BUNDLE = 'CHANGE_BUNDLE';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
export const CHANGE_ACTIVE = 'CHANGE_ACTIVE';
export const UPDATE_PAYLOAD = 'UPDATE_PAYLOAD';
export const CHANGE_ACTIVE_PLATFORM = 'CHANGE_ACTIVE_PLATFORM';
export const SET_ACTIVE_CHAIN = 'SET_ACTIVE_CHAIN';

export const addWatchAddress = address => {
    return {
        type: ADD_WATCH_ADDRESS,
        payload: address,
    };
};

export const connectAddress = address => {
    return {
        type: CONNECT_ADDRESS,
        payload: address,
    };
};

export const disconnectAddress = address => {
    return {
        type: DISCONNECT_ADDRESS,
        payload: address,
    };
};

export const clearAddresses = () => {
    return {
        type: CLEAR_ADDRESSES,
    };
};

export const changeLabel = (address, label) => {
    return {
        type: CHANGE_LABEL,
        payload: {
            address,
            label,
        },
    };
};

export const changeBundle = (address, bundle) => {
    return {
        type: CHANGE_BUNDLE,
        payload: {
            address,
            bundle,
        },
    };
};

export const deleteAccount = address => {
    return {
        type: DELETE_ACCOUNT,
        payload: {
            address,
        },
    };
};

export const changeActive = (type, address) => {
    return {
        type: CHANGE_ACTIVE,
        payload: {
            activeType: type,
            address,
        },
    };
};

export const updatePayload = payload => {
    return {
        type: UPDATE_PAYLOAD,
        payload: {
            data: payload,
        },
    };
};

export const changeActivePlatform = payload => {
    return {
        type: CHANGE_ACTIVE_PLATFORM,
        payload,
    };
};

export const setActiveChain = id => {
    return {
        type: SET_ACTIVE_CHAIN,
        payload: id,
    };
};
