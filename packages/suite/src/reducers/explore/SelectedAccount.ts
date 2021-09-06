import produce from 'immer';
import * as SelectedAccount from '@explore-actions/constants/SelectedAccountConstants';
import { Action } from '@suite-types';
import { STORAGE } from '@suite-actions/constants';
import { Account } from '@wallet-types';

type SelectedAccountState = {
    current?: Account;
};

const initialState = {};

const SelectedAccountReducer = (
    state: SelectedAccountState = initialState,
    action: Action,
): SelectedAccountState => {
    return produce(state, draft => {
        switch (action.type) {
            case SelectedAccount.SET:
                draft.current = action.payload;
                break;
            case STORAGE.LOADED:
                return action.payload.explore.selectedAccount;
            // no default
        }
    });
};

export default SelectedAccountReducer;
