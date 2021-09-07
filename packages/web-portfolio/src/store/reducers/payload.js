import { UPDATE_PAYLOAD } from '../actions';

const INIT_STORE = {};

export default (store = INIT_STORE, action) => {
    if (action.type === UPDATE_PAYLOAD) {
        return action.payload.data;
    }
    return store;
};
