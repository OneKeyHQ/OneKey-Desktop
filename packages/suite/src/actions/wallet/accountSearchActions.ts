import { Account } from '@wallet-types';
import { ACCOUNT_SEARCH } from '@wallet-actions/constants';

export type AccountSearchAction =
    | {
          type: typeof ACCOUNT_SEARCH.SET_COIN_FILTER;
          payload?: Account['symbol'];
      }
    | {
          type: typeof ACCOUNT_SEARCH.SET_SEARCH_STRING;
          payload?: string;
      }
    | {
          type: typeof ACCOUNT_SEARCH.ADD_NEW_ACCOUNTS;
          payload: string;
      }
    | {
          type: typeof ACCOUNT_SEARCH.REMOVE_NEW_ACCOUNTS;
          payload: string;
      }
    | {
          type: typeof ACCOUNT_SEARCH.CLEAN_NEW_ACCOUNTS;
      };

export const setCoinFilter = (payload?: Account['symbol']): AccountSearchAction => ({
    type: ACCOUNT_SEARCH.SET_COIN_FILTER,
    payload,
});

export const setSearchString = (payload?: string): AccountSearchAction => ({
    type: ACCOUNT_SEARCH.SET_SEARCH_STRING,
    payload,
});

export const addNewAccount = (payload: string): AccountSearchAction => ({
    type: ACCOUNT_SEARCH.ADD_NEW_ACCOUNTS,
    payload,
});

export const removeNewAccount = (payload: string): AccountSearchAction => ({
    type: ACCOUNT_SEARCH.ADD_NEW_ACCOUNTS,
    payload,
});

export const cleanNewAccounts = (): AccountSearchAction => ({
    type: ACCOUNT_SEARCH.CLEAN_NEW_ACCOUNTS,
});
