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
    screens: {
      'xs': '400px',
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        green: {
          DEFAULT: '#BDF8CE',
          border: '#47C992'
        }
      },
      // screens: {
      //   'xs': '370px'
      // }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
