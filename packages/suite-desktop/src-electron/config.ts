import { TOR_DOMAIN } from '@suite-constants/urls';

export const onionDomain = TOR_DOMAIN;

export const oauthUrls = [
    'https://accounts.google.com',
    'https://www.dropbox.com/oauth2/authorize',
];

export const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'trezor.io',
    'invity.io',
    'api.github.com',
    'api.dropboxapi.com',
    'content.dropboxapi.com',
    'notify.dropboxapi.com',
    'o554666.ingest.sentry.io',
    'oauth2.googleapis.com',
    'googleapis.com',
    'onekey.so',
    'swap.onekey.so',
    '243096.com',
    onionDomain,
];

export const cspRules = [
    // Default to only own resources
    "default-src 'self' 'unsafe-inline' onekey.243096.com dev.243096.com",
    // Allow all API calls (Can't be restricted bc of custom backends)
    'connect-src *',
    // Allow images from trezor.io
    "img-src 'self' onekey.243096.com devs.243096.com onekey.so *.onekey.so",
];
