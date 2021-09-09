const { ESLINT_MODES } = require('@craco/craco');

module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss/nesting'),
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    eslint: {
        // Craco eslint seems to be broken
        enable: false,
        mode: ESLINT_MODES.file,
    },
    jest: {
        enable: false,
    },
};
