const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          "@components": "./src/components",
          "@utils": "./src/utils",
          "@store": "./src/store",
          "@locales": "./src/locales",
          "@layout": "./src/layout",
        },
      },
    },
  ],
  style: {
    postcss: {
      plugins: [
        require("tailwindcss/nesting"),
        require("tailwindcss"),
        require("autoprefixer"),
      ],
    },
  },
};