import * as SelectedAccount from './constants/SelectedAccountConstants';

import { Dispatch, GetState } from '@suite-types';
import { Account } from '@wallet-types';

export type SelectedAccountActions =
    | {
          type: typeof SelectedAccount.SET;
          payload: Account;
      }
    | {
          type: typeof SelectedAccount.GET;
      };

export const setSelectedAccount = (payload: Account) => (dispatch: Dispatch) => {
    dispatch({ type: SelectedAccount.SET, payload });
};

export const getSelectedAccount = () => (_dispatch: Dispatch, getState: GetState) => {
    return getState().explore.favorite;
};
