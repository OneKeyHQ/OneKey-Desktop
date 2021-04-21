/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-inner-declarations */
/* eslint-disable import/extensions */
import './dist.js';
import { ipcRenderer } from 'electron';

declare global {
    interface Window {
        config: Config;
        injectWeb3Config: (config: Config) => void;
        trustwallet: {
            Provider: any;
            customMethodMessage: any;
            Web3: any;
        };
        chrome: {
            webstore: any;
        };
        ethereum: any;
        web3: any;
        webkit: any;
        store: any;
        $ONEKEY_WEB3_INJECTED: boolean;
        $ONEKEY_SETTINGS_THEME: 'light' | 'dark';
        $ONEKEY_SETTINGS_LANGUAGE: 'zh' | 'en';
    }
}

type Message = {
    id: string;
    object: {
        data: string;
        params: Record<string, string | number | boolean>;
    } & Record<string, string | number | boolean>;
};

type Config = {
    address: string;
    rpcUrl?: string;
    chainId: number;
    debug?: boolean | 'true' | 'false';
};

function getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function safeTouchJSONStr<T = Record<string, unknown>>(str: string | undefined | null): T {
    if (str == null) return {} as T;
    try {
        return JSON.parse(str);
    } catch (e) {
        return {} as T;
    }
}

try {
    console.log('Onekey web3 provider init start');

    function injectWeb3Config() {
        console.log('Onekey web3 injecter start');
        const jsonStr = getParameterByName('config');

        const config = safeTouchJSONStr<Config>(jsonStr);
        window.config = config;
        const provider = new window.trustwallet.Provider(config);
        function debugPrint(...args: any[]) {
            if (provider.isDebug) {
                console.log(args);
            }
        }

        window.trustwallet.customMethodMessage = {
            personalEcRecover: {
                postMessage: (message: Message) => {
                    provider.sendResponse(message.id, message.object.data);
                },
            },
            signMessageHash: {
                postMessage: (message: Message) => {
                    debugPrint('init.js signMessage', message.object.data);
                    const { id } = message;
                    const messageHex = message.object.data;
                    const payload = message.object.params;
                    ipcRenderer.sendToHost('sign/message', {
                        id,
                        messageHex,
                        payload,
                    });
                },
            },
        };

        provider.isDebug = config.debug === 'false' ? false : !!config.debug;
        window.ethereum = provider;
        window.web3 = new window.trustwallet.Web3(provider);
        window.web3.eth.defaultAccount = config.address;

        window.chrome = { webstore: {} };

        function executeCallback(
            id: string,
            error: null | any,
            result: Record<string, string> | string[] | string,
        ) {
            if (error == null) {
                debugPrint('init.js send Response', id, JSON.stringify(result));
                provider.sendResponse(id, result);
            } else {
                debugPrint('init.js send Error', id, error);
                provider.sendError(id, error);
            }
        }

        window.web3.setProvider = function setProvider() {
            console.debug('Onekey Wallet - overrode web3.setProvider');
        };

        window.webkit = {
            messageHandlers: {
                signTransaction: {
                    postMessage: (message: Message) => {
                        debugPrint('init.js sign Transaction', JSON.stringify(message));

                        const { id } = message;
                        const tx = message.object;

                        const gasLimit = tx.gasLimit || tx.gas || null;
                        const gasPrice = tx.gasPrice || null;
                        const data = tx.data || null;
                        const nonce = tx.nonce || '0x00';

                        ipcRenderer.sendToHost('sign/transaction', {
                            id,
                            transaction: {
                                ...tx,
                                gasLimit,
                                gasPrice,
                                data,
                                nonce,
                            },
                        });
                    },
                },
                requestAccounts: {
                    postMessage: (message: Message) => {
                        debugPrint('init.js request accounts', JSON.stringify(message));
                        executeCallback(message.id, null, [config.address]);
                    },
                },
                addEthereumChain: {
                    postMessage: (message: Message) => {
                        debugPrint('init.js add ethereum chain', JSON.stringify(message));
                    },
                },
            },
        };

        ipcRenderer.on('sign/broadcast', (event, params) => {
            debugPrint('inject.ts event', event, params);
            if (params.id) {
                executeCallback(params.id, params.error, params.txid);
            }
        });

        console.log('Onekey web3 injecter done');
    }

    injectWeb3Config();

    const settings = safeTouchJSONStr<{ theme: 'light' | 'dark'; language: 'zh' | 'en' }>(
        getParameterByName('settings'),
    );

    window.$ONEKEY_WEB3_INJECTED = true;
    window.$ONEKEY_SETTINGS_THEME = settings.theme || 'light';
    window.$ONEKEY_SETTINGS_LANGUAGE = settings.language || 'zh';
    window.injectWeb3Config = injectWeb3Config;

    console.log('Onekey web3 provider init done');

    // TODO: use context isolation
    // contextBridge.exposeInMainWorld('trustwallet', window.trustwallet);
    // contextBridge.exposeInMainWorld('config', window.config);
    // contextBridge.exposeInMainWorld('ethereum', window.ethereum);
    // contextBridge.exposeInMainWorld('chrome', window.chrome);
    // contextBridge.exposeInMainWorld('web3', window.web3);
} catch (e) {
    console.log('Inject Script Error', e);
}
