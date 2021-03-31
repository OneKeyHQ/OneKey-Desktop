import { MiddlewareAPI } from 'redux';
import { BLOCKCHAIN, ACCOUNT, TRANSACTION } from '@wallet-actions/constants';
import { WALLET_SETTINGS } from '@settings-actions/constants';
import * as fiatRatesActions from '@wallet-actions/fiatRatesActions';
import { AppState, Action, Dispatch } from '@suite-types';

const fiatRatesMiddleware = (api: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (
    action: Action,
): Action => {
    const prevState = api.getState();
    // pass action
    next(action);

    switch (action.type) {
        // ACTION来源：
        //      BlockchainLink worker 收到已连接的message：'r_connected'
        //  node_modules/@onekeyhq/connect/lib/backend/BlockchainLink.js.flow L93
        //      link.on('connected')
        //      postMessage(BlockchainMessage(BLOCKCHAIN.CONNECT,{...}))
        //  packages/blockchain-link/src/index.ts L253
        //      BlockchainLink emit('connected')
        case BLOCKCHAIN.CONNECTED:
            // 启动法币价格更新定时器（1分钟轮询）
            api.dispatch(fiatRatesActions.initRates());
            break;
        // ACTION来源：
        //      BlockchainLink wss订阅 subscribeFiatRates，触发fiatRates事件，
        //                     分发动作BLOCKCHAIN.FIAT_RATES_UPDATE，更新价格
        //  node_modules/@onekeyhq/connect/lib/backend/BlockchainLink.js.flow L202
        //        link.on('fiatRates')
        //        postMessage(BlockchainMessage(BLOCKCHAIN.FIAT_RATES_UPDATE))
        //  packages/blockchain-link/src/workers/blockbook/websocket.ts L350
        //        Socket send('subscribeFiatRates', { currency })
        //        Socket emit('fiatRates')
        case BLOCKCHAIN.FIAT_RATES_UPDATE:
            // wss推送指定币种的价格实时更新
            api.dispatch(fiatRatesActions.onUpdateRate(action.payload));
            break;
        // ACTION来源： 任何需要刷新account信息及tx数据时
        //  packages/suite/src/actions/wallet/accountActions.ts L155
        case TRANSACTION.ADD:
            // 更新tx上的时间历史价格
            // fetch historical rates for each added transaction
            api.dispatch(fiatRatesActions.updateTxsRates(action.account, action.transactions));
            break;
        case ACCOUNT.UPDATE: {
            // fetch rates for new tokens added on account update
            const account = action.payload;
            const prevAccount = prevState.wallet.accounts.find(
                a => a.descriptor === account.descriptor && a.symbol === account.symbol,
            );

            if (account.tokens) {
                const difference = account.tokens.filter(
                    t => !prevAccount?.tokens?.find(prevT => prevT.symbol === t.symbol),
                );

                difference.forEach(t => {
                    if (t.symbol) {
                        api.dispatch(
                            fiatRatesActions.updateCurrentRates({
                                symbol: t.symbol,
                                mainNetworkSymbol: account.symbol,
                                tokenAddress: t.address,
                            }),
                        );
                    }
                });
            }
            break;
        }
        case ACCOUNT.CREATE: {
            // fetch current rates for account's tokens
            const account = action.payload;
            if (account.tokens) {
                account.tokens.forEach((t, i) => {
                    if (t.symbol) {
                        const s = t.symbol;
                        // wait 500ms before firing next fetch
                        setTimeout(() => {
                            api.dispatch(
                                fiatRatesActions.updateCurrentRates({
                                    symbol: s,
                                    mainNetworkSymbol: account.symbol,
                                    tokenAddress: t.address,
                                }),
                            );
                        }, i * 500);
                    }
                });
            }
            break;
        }
        case WALLET_SETTINGS.CHANGE_NETWORKS:
            api.dispatch(fiatRatesActions.removeRatesForDisabledNetworks());
            break;
        case WALLET_SETTINGS.SET_LOCAL_CURRENCY:
            // for coins relying on coingecko we only fetch rates for one fiat currency
            api.dispatch(fiatRatesActions.updateLastWeekRates());
            break;
        default:
            break;
    }

    return action;
};

export default fiatRatesMiddleware;
