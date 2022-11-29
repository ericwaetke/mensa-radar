module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    container: {
      padding: '2rem',
    },
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],

      'serif-reg': ["IBM-Reg", "serif-reg"],
      'serif-med': ["IBM-Medium", "serif-med"],
      'serif-semi': ["IBM-Semi", "serif-semibold"],
      'serif-bold': ["IBM-Bold", "serif-bold"],
      'sans-reg': ["Noto-Reg", "sans-reg"],
      'sans-med': ["Noto-Medium", "sans-med"],
      'sans-semi': ["Noto-Semi", "sans-semibold"],
      'sans-bold': ["Noto-Bold", "sans-bold"],
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
        'light-green': '#E2EEE3',
        'lightshiny-green': '#B9D8C2',
        'main-green': '#88E2A1',
        'dark-green': '#43BC63',
        'gray': '#1F2132',
        'white': '#fff',
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
