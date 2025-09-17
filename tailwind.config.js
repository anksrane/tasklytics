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
          // primary: {
          //   100: '#5e8677', // Hooker's Green (light tint)
          //   500: '#012244', // Brunswick Green (base primary)
          //   900: '#1c3136', // Gunmetal / Rich Black (darkest shade)
          // },

          // secondary: {
          //   100: '#FFF4BF', // Lemon Chiffon
          //   500: '#FFD700', // Gold (web gold)
          //   900: '#7A5C00', // Field Drab / Dark Golden Brown
          // },

          // neutral: {
          //   100: '#ffffff', // White (pure)
          //   500: '#faf4d3', // Cornsilk (soft neutral paper tone)
          //   900: '#090c02', // Smoky Black (very dark neutral)
          // },

          // text: {
          //   light: '#ffffff', // White (for dark backgrounds)
          //   dark: '#000000',  // True Black
          //   black: '#090c02', // Smoky Black (for rich dark text)
          // },

          // accent: {
          //   danger: '#dc3545',   // Crimson Red (Bootstrap danger)
          //   success: '#28a745',  // Medium Green / Malachite
          //   info: '#17a2b8',     // Light Sea Green / Teal Cyan
          //   disabled: '#6c757d', // Dark Gray / Granite Gray
          //   warning: '#ffc107',  // Amber / Bright Sun
          // }

          primary: {
            100: '#B3E5FC', // Light Cyan (soft UI highlights, hover states)
            500: '#00498B', // Deep Blue (brand base, buttons, headers)
            900: '#002A4D', // Navy Black (strong accents, sidebar bg)
          },

          secondary: {
            100: '#FFF8E1', // Light Cream
            500: '#FFC107', // Amber / Gold
            900: '#7A4F01', // Dark Golden Brown
          },

          neutral: {
            100: '#FFFFFF', // White (main bg, popup forms)
            500: '#F5F7FA', // Soft Gray (table rows, input bg)
            900: '#0A0A0A', // Rich Black (text/icons in light mode, dark bg in dark mode)
          },

          text: {
            light: '#FFFFFF', // White (text on gradient / dark bg)
            dark: '#1A1A1A',  // Near Black (text on light bg)
            black: '#090C02', // Smoky Black (titles/headings)
          },

          accent: {
            danger: '#dc3545',   // Red (delete button, error alert)
            success: '#28a745',  // Green (task completed, success alert)
            info: '#17a2b8',     // Teal Cyan (informational alerts, tooltips)
            disabled: '#6c757d', // Gray (disabled buttons, muted UI)
            warning: '#ffc107',  // Amber (warnings, caution highlights)
          },          
        },
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
    },
    screens:{
      'xs': "450px",
      'sm': "641px",
      'md': "769px",
      'lg': "1025px",
      'xl': "1280px",
      "2xl": "1536px"
    }      
  },
  plugins: [],
}

