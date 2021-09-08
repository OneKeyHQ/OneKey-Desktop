import React from 'react';
import ReactDOM from 'react-dom';
import { UIProvider } from '@onekeyhq/ui-components';
import locale from './locale';

import App from './App';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <UIProvider messagesMap={locale}>
      <App />
    </UIProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
