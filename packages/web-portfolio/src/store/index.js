import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import reducer from './reducers';

import { CACHE_KEY, ACTIVE_CACHE_KEY } from '@utils/config';

const logger = createLogger();
const store = createStore(
    reducer,
    process.env.NODE_ENV !== 'production' ? applyMiddleware(logger) : undefined,
);

store.subscribe(() => {
    const { device, active } = store.getState();
    if (localStorage) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(device));
        localStorage.setItem(ACTIVE_CACHE_KEY, JSON.stringify({ account: active.account }));
    }
});

if (process.env.NODE_ENV !== 'production') {
    window.store = store;
}

export default store;
