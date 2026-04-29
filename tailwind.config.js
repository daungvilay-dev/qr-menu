/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        navy: {
          950: '#070c18',
          900: '#0a0f1e',
          800: '#0d1526',
          700: '#111827',
          600: '#1a2234',
          500: '#1e293b',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Noto Sans Lao', 'Phetsarath OT', 'Lao UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 18px 40px -24px rgba(245, 158, 11, 0.15)',
      },
    },
  },
  plugins: [],
}
