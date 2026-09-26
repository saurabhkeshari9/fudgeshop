/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF5ED',
          200: '#F4EBDC',
          300: '#EBDCC5',
          400: '#DFC9A8',
        },
        chocolate: {
          50: '#F5F0EE',
          100: '#E6D9D5',
          200: '#CBB2AA',
          300: '#AC8B7F',
          400: '#845A4D',
          500: '#5F3B30',
          600: '#4D2E24',
          700: '#3D231B',
          800: '#2E1912',
          900: '#1F100B',
          950: '#140A07',
        },
        caramel: {
          100: '#FBEEDC',
          200: '#F5DBB4',
          300: '#ECC387',
          400: '#E1A959',
          500: '#C98528',
          600: '#B06E1A',
          700: '#8E5312',
          800: '#703F10',
        },
        berry: {
          100: '#FCE7EA',
          200: '#F8C5CC',
          500: '#B9334A',
          700: '#7E2231',
          800: '#5B1522',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'artisan': '0 4px 20px -2px rgba(44, 26, 20, 0.08)',
        'artisan-lg': '0 12px 32px -4px rgba(44, 26, 20, 0.12)',
        'artisan-hover': '0 16px 36px -6px rgba(44, 26, 20, 0.16)',
      }
    },
  },
  plugins: [],
}
