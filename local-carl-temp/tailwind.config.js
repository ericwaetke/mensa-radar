/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {},
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
    colors: {
      'light-green': '#E2EEE3',
      'main-green': '#88E2A1',
      'dark-green': '#43BC63',
      'gray': '#1F2132',
      'white': '#fff',
    }
  },
  plugins: [],
}
