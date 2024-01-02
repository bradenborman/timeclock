module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.65rem', // (around 10px)
      }
    }
  }
};
