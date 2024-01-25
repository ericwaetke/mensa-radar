/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    container: {
      padding: '2rem',
    },
    fontFamily: {
      'sans': ['NotoSans-Variable', 'system-ui'],
      'serif': ["BespokeSerif-Variable", "serif-reg"],
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
    colors: {
      white: "#fff",
      backgrounds: {
        "container": "#CFE0D1"
      },
      sec: {
        "light-text": "#596E5B",
        kontur: "rgba(31, 33, 50, 0.17)",
        green: {
          "darker": "#008C25"
        }
      },
    },
    extend: {
      screens: {
        'xs': '370px'
      },
      animation: {
        expand: 'expand 250ms ease-in-out',
        collapse: 'collapse 250ms ease-in-out',
      },
      keyframes: {
        expand: {
          '0%': {
            height: '0px',
          },
          '100%': {
            height: 'var(--corvu-disclosure-content-height)',
          },
        },
        collapse: {
          '0%': {
            height: 'var(--corvu-disclosure-content-height)',
          },
          '100%': {
            height: '0px',
          },
        },
      },
    },
  },
  plugins: [
    require('@corvu/tailwind'),
  ]
};
