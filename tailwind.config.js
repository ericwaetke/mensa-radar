module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      padding: '2rem',
    },
    fontFamily: {
      'sans': ['DM Sans'],
      'display': ['Sen']
    },
    extend: {
      colors: {
        green: {
          DEFAULT: '#BDF8CE',
          border: '#47C992'
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
