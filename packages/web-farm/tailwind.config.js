const { colors, boxShadow, screens, borderRadius, fontFamily } = require('@onekeyhq/ui-components/utils/tailwind');

module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily,
        },
        borderRadius,
        colors,
        screens,
        boxShadow,
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
