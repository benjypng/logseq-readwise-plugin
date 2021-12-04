module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.{vue,js,ts,jsx,tsx,hbs,html}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        100: '32rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
