/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        paper: '#FAF9F6',
        navy: {
          50: '#F1F4F9',
          100: '#DDE3EE',
          400: '#3E5273',
          500: '#243452',
          600: '#182238',
          700: '#0F172A',
          900: '#080D18',
        },
        accent: {
          50: '#FAF5E7',
          100: '#F1E3BE',
          200: '#E6CE8F',
          400: '#D6B562',
          500: '#C9A24B',
          600: '#AD8638',
          700: '#8C6B2C',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 2px 14px -4px rgba(15,23,42,0.10)',
        card: '0 12px 32px -10px rgba(15,23,42,0.20)',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
}