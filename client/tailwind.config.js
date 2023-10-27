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
      rotate: {
        '720': '720deg',
      }
    },
  },
  plugins: [],
}

