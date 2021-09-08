import produce from 'immer';
import { FeeLevel } from '@onekeyhq/connect';
import { STORAGE } from '@suite-actions/constants';
import { WALLET_SETTINGS } from '@settings-actions/constants';
import { Action } from '@suite-types';
import { Network } from '@wallet-types';
import { BlockbookUrl } from '@wallet-types/blockbook';

export interface State {
    localCurrency: string;
    discreetMode: boolean;
    hide0BalanceWallet: boolean;
    enabledNetworks: Network['symbol'][];
    lastUsedFeeLevel: {
        [key: string]: Omit<FeeLevel, 'blocks'>; // Key: Network['symbol']
    };
    blockbookUrls: BlockbookUrl[];
    ethAccountIndex: number;
}

export const initialState: State = {
    localCurrency: 'usd',
    discreetMode: false,
    hide0BalanceWallet: false,
    enabledNetworks: ['btc'],
    lastUsedFeeLevel: {},
    blockbookUrls: [],
    ethAccountIndex: -1,
};

const settingsReducer = (state: State = initialState, action: Action): State => {
    return produce(state, draft => {
        switch (action.type) {
            case STORAGE.LOADED:
                return action.payload.wallet.settings;

            case WALLET_SETTINGS.SET_LOCAL_CURRENCY:
                draft.localCurrency = action.localCurrency;
                break;

            case WALLET_SETTINGS.SET_HIDE_BALANCE:
                draft.discreetMode = action.toggled;
                break;

            case WALLET_SETTINGS.SET_HIDE_0_BALANCE_WALLET:
                draft.hide0BalanceWallet = action.payload;
                break;
            case WALLET_SETTINGS.SET_ETH_ACCOUNT_INDEX:
                draft.ethAccountIndex = action.payload;
                break;

            case WALLET_SETTINGS.CHANGE_NETWORKS:
                draft.enabledNetworks = action.payload;
                break;

            case WALLET_SETTINGS.SET_LAST_USED_FEE_LEVEL:
                if (action.feeLevel) {
                    draft.lastUsedFeeLevel[action.symbol] = action.feeLevel;
                } else {
                    delete draft.lastUsedFeeLevel[action.symbol];
                }
                break;

            case WALLET_SETTINGS.SET_BLOCKBOOK_URLS:
                draft.blockbookUrls = action.payload;
                break;

            case WALLET_SETTINGS.ADD_BLOCKBOOK_URL:
                draft.blockbookUrls.push(action.payload);
                break;

            case WALLET_SETTINGS.REMOVE_BLOCKBOOK_URL: {
                const { coin, url } = action.payload;
                const index = draft.blockbookUrls.findIndex(b => b.coin !== coin && b.url !== url);
                draft.blockbookUrls.splice(index, 1);
                break;
            }

            case WALLET_SETTINGS.CLEAR_TOR_BLOCKBOOK_URLS:
                draft.blockbookUrls = draft.blockbookUrls.filter(u => !u.tor);
                break;

            // no default
        }
    });
};

export default settingsReducer;
