import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { save, load } from 'redux-localstorage-simple';

const PERSISTED_KEYS: string[] = [];

const excludeLogger = (_getState: any, action: any): boolean => {
    const excluded = ['@log/add', undefined];
    const pass = excluded.filter(act => action.type === act);
    return pass.length === 0;
};

const store = configureStore({
    reducer: {},
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ thunk: true })
            .concat(save({ states: PERSISTED_KEYS, debounce: 1000 }))
            .concat(
                createLogger({
                    level: 'info',
                    predicate: excludeLogger,
                    collapsed: true,
                }),
            ),
    preloadedState: load({
        states: PERSISTED_KEYS,
        disableWarnings: process.env.NODE_ENV === 'test',
    }),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
