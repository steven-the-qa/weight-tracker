/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}",],
  darkMode: 'class',
  theme: {
    fontFamily: {
      'Karla': ['Karla', 'sans-serif'],
      'Kanit': ['Kanit', 'sans-serif']
    },
    extend: {
      screens: {
        'xs': '450px'
      }
    }
  },
  plugins: [require("daisyui")],
}