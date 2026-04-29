/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f4ea',
          100: '#eee5cc',
          200: '#ddc996',
          300: '#cbab65',
          400: '#bf9345',
          500: '#a9792d',
          600: '#8f6123',
          700: '#74491d',
          800: '#603c1c',
          900: '#52341a',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 40px -24px rgba(40, 28, 11, 0.35)',
      },
    },
  },
  plugins: [],
}
