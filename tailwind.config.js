/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fbfaf7',
          100: '#f3efe6',
          200: '#e6dcc3',
          300: '#d8c58f',
          400: '#cfae5a',
          500: '#e1b23c', // main logo gold (close to what you're using)
          600: '#c99c33', // hover (darker, NOT orange)
          700: '#a9822a', // active
        },
      },
    },
  },
  plugins: [],
};
