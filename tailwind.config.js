/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class', // enables toggling with .dark class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      backgroundSize: {
        '200%': '200% 100%',
      },
      keyframes: {
        'gradient-x': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          surface: 'var(--surface)',
          overlay: 'var(--overlay)',
        },
        header:{
          DEFAULT: 'var(--header)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
        },
        text: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          light: 'var(--text-light)',
          dark: 'var(--text-black)',
        },
        table:{
          DEFAULT: 'var(--table)',
          secondary: 'var(--table-secondary)',
          light: 'var(--table-light)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: 'var(--border-light)',
          borderBg: 'var(--border-dark)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
        },
        success: {
          DEFAULT: 'var(--success)',
        },
        disabled: {
          DEFAULT: 'var(--disabled)',
        },
        active: {
          DEFAULT: 'var(--active)',
        },
        inactive: {
          DEFAULT: 'var(--inactive)',
        },
      }
    },
    screens: {
      'xs': "450px",
      'sm': "641px",
      'md': "769px",
      'lg': "1025px",
      'xl': "1280px",
      '2xl': "1536px",
    },
  },
  plugins: [],
}
