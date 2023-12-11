/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
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
      'sans-black': ["Noto-Black", "sans-black"],
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
        //green
        'light-green': '#CFE0D1',
        'arc-bg': 'var(--arc-pallette-background',

        //foto-bg
        'lightshiny-green': '#B3C0B5',
        'main-green': '#88E2A1',
        'dark-green': '#008C25',

        //vegetarisch, fleisch, fisch
        'vegeterian-yellow': '#CBE288',
        'meat-red': '#FFB0A6',
        'fish-blue': '#90D3FA',

        'gray': '#1F2132',
        'white': '#fff',
      },
      screens: {
        'xs': '370px'
      },
    },
  },
  plugins: []
};
