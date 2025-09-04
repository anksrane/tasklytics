/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['Roboto',...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          'primary': '#003D3A',
          'primary-light': '#5E8677',
          'primary-dark': '#0a2625',
          'secondary': '#FFD61F',
          'secondary-light': '#FFE985',
          'secondary-lighter': '#FAF4D3',
          'secondary-dark': '#D1AC00',
          'background': '#090C02',
          'background-dark':'#0C1618',
          'surface': '#FFFFFF',
          'text': '#090C02',
          'text-white': '#FFFFFF',
          'text-black': '#000',
          'accent': '#FFE985',
        },
      },      
    },
  },
  plugins: [],
}

