const colors = require('@onekeyhq/ui-components/utils/tailwind');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    colors,
  },
  variants: {
    extend: {},
  },
};
