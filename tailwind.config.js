/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    fontFamily: {
      'Karla': ['Karla', 'sans-serif'],
      'Kanit': ['Kanit', 'sans-serif']
    }
  },
  plugins: [require("daisyui")],
}