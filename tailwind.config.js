module.exports = {
    theme: {
      extend: {},
    },
    plugins: [
      function ({ addVariant }) {
        addVariant("landscape", "@media (orientation: landscape)");
      },
    ],
  };