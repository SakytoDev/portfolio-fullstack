/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    fontFamily: {
      helvetica: ['Helvetica'],
      miratrix: ['Miratrix']
    },
    extend: {
      keyframes: { spinner: { '0%': { transform: 'rotate(180deg)' }, '100%': { transform: 'rotate(-180deg)' } } },
      animation: { spinner: 'spinner 0.5s linear infinite' },
      rotate: { '720': '720deg' }
    },
  },
  plugins: [],
}

