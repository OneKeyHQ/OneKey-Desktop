const defaultTheme = require('tailwindcss/defaultTheme');
const { colors, boxShadow, screens } = require('@onekeyhq/ui-components/utils/tailwind');

module.exports = {
    mode: 'jit',
    purge: {
        mode: 'all',
        content: ['./src/**/*.{js,jsx,ts,tsx}'],
    },
    darkMode: 'media',
    theme: {
        extend: {
            colors: colors,
            screens: screens,
            fontFamily: {
                sans: [
                    ...defaultTheme.fontFamily.sans,
                    'PingFang SC',
                    '"Microsoft YaHei"',
                    '"Source Han Sans SC"',
                    '"Noto Sans CJK SC"',
                    'WenQuanYi Micro Hei',
                ],
            },
        },
        boxShadow: boxShadow,
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};
