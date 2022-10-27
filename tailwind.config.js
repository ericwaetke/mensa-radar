module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', "./app/**/*.{js,ts,jsx,tsx}",],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      padding: '2rem',
    },
    fontFamily: {
      'sans': ['Noto Sans', 'sans-serif'],
      'bigtext': ['Noto Sans', 'sans-serif'],
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
        'main-white': '#FFFFFF',
        'main-black': '#161616',
        'main-green': '#88E2A1',

        'sec-green-dark': '#43BC63',
        'sec-stroke': '#16161633',
        'sec-text-light': '#00000080',

        'background-container': '#ECF1EC',
        'background-progress-bar': '#DBDBDB'
      },
      screens: {
        'xs': '370px'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
