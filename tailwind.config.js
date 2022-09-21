module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      padding: '2rem',
    },
    fontFamily: {
      'sans': ['DM Sans'],
      'serif': ['IBM Plex Serif', 'serif']
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
          border: '#D8E7D9'
        },
        'custom-bg': "#E5E7E5",
        'custom-black': '#161616',
        'custom-green': '#88E2A1',
        'custom-half-green': '#DBDBDB',
        'custom-dark': '#969996',
        'custom-light-gray': '#F2F2F2',
        'custom-dark-green': '#43BC63',
        'custom-white': '#FFFFFF',
        'custom-divider': '#C1C5C1',
        'modal-green': '#ECF1EC'
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
