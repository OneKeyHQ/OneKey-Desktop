const defaultTheme = require("tailwindcss/defaultTheme");
const {
  colors,
  boxShadow,
  screens,
} = require("@onekeyhq/ui-components/utils/tailwind");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: [
          ...defaultTheme.fontFamily.sans,
          "PingFang SC",
          '"Microsoft YaHei"',
          '"Source Han Sans SC"',
          '"Noto Sans CJK SC"',
          "WenQuanYi Micro Hei",
        ],
      },
    },
    borderRadius: {
      none: "0",
      sm: "0.375rem",
      DEFAULT: "0.75rem",
      lg: "1.5rem",
      full: "9999px",
    },
    colors: colors,
    screens: screens,
    boxShadow: boxShadow,
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
