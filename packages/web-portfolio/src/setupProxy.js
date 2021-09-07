/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy.createProxyMiddleware('/v1', {
            target: 'https://defi.onekey.so',
            changeOrigin: true,
            secure: false,
        }),
    );
};
