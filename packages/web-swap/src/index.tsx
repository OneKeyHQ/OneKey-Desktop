import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { UIProvider } from '@onekeyhq/ui-components';

import App from './pages/App';
import localeMessages from './locales';
import store from './state';

import '@onekeyhq/ui-components/index.css';
import './index.css';

const Index = () => {
    return (
        <StrictMode>
            <UIProvider defaultLocale="en-US" messagesMap={localeMessages}>
                <Provider store={store}>
                    <HashRouter>
                        <App />
                    </HashRouter>
                </Provider>
            </UIProvider>
        </StrictMode>
    );
};

ReactDOM.render(<Index />, document.getElementById('root'));
