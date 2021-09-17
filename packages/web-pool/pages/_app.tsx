import React from 'react';
import 'tailwindcss/tailwind.css';
import '@onekeyhq/ui-components/index.css';

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
