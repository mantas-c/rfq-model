/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './app/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './nuxt.config.ts',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#14A34A',
          'green-light': '#1ec95c',
          'green-dark': '#0f7c38',
        },
        // Override Tailwind's built-in green scale so every green-* class uses #14A34A as the 500 base
        green: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#14A34A',
          600: '#0f7c38',
          700: '#0a5227',
          800: '#075c2a',
          900: '#054020',
          950: '#02200f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
