/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-serif)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#f0f7f4',
          100: '#d9ebe2',
          500: '#2d6a4f',
          600: '#245741',
          700: '#1b4332',
          900: '#0f261d',
        },
      },
    },
  },
  plugins: [],
};
