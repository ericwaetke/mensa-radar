import corvu from "@corvu/tailwind"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        expand: 'expand 250ms cubic-bezier(0.32,0.72,0,0.75)',
        collapse: 'collapse 250ms cubic-bezier(0.32,0.72,0,0.75)',
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
    fontFamily: {
      bespoke: ['BespokeSlab-Variable', 'sans-serif'],
      noto: ['Noto Sans Variable', 'sans-serif'],
    },
  },
  plugins: [corvu],
}
