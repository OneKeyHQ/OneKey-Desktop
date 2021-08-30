import * as SelectedAccount from './constants/SelectedAccountConstants';

import { Dispatch, GetState } from '@suite-types';

export type SelectedAccountActions =
    | {
          type: typeof SelectedAccount.SET;
          payload: string;
      }
    | {
          type: typeof SelectedAccount.GET;
          payload: string;
      };

export const setSelectedAccoount = (payload: string) => (dispatch: Dispatch) => {
    dispatch({ type: SelectedAccount.SET, payload });
};

export const getSelectedAccount = () => (_dispatch: Dispatch, getState: GetState) => {
    return getState().explore.favorite;
};
