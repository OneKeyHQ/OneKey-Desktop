import { CaptureConsole } from '@sentry/integrations';
import { BrowserOptions } from '@sentry/browser';
import { TOR_DOMAIN } from '@suite-constants/urls';

export default {
    dsn: 'https://a7d74121d386447a8a25363a61599985@o554666.ingest.sentry.io/5688891',
    normalizeDepth: 10,
    integrations: [
        new CaptureConsole({
            levels: ['error'],
        }),
    ],
    release: process.env.COMMITHASH,
    environment: process.env.SUITE_TYPE,
    beforeBreadcrumb(breadcrumb) {
        if (breadcrumb.category === 'console') {
            return null;
        }
        return breadcrumb;
    },
    beforeSend(event, hint) {
        const error = hint?.syntheticException;
        const re = new RegExp(`FiatRatesFetchError.*${TOR_DOMAIN}`, 'gmi');
        if (error?.message?.match(re)) {
            // discard failed fiat rate fetch on TOR
            event.fingerprint = ['FiatRatesFetchError'];
            return null;
        }
        return event;
    },
} as BrowserOptions;
