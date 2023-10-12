/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      rotate: {
        '720': '720deg',
      },
      keyframes: {
        cardAppear: {
          '0%': { transform: 'translateX(-300px)', opacity: 0 },
          '100%': { transform: 'translateX(0px)', opacity: 100 }
        }
      },
      animation: {
        'card-appear': 'cardAppear 0.9s ease-in-out'
      }
    },
  },
  plugins: [],
}

