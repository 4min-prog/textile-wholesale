/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/index.html', './client/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1A1A2E',
        'navy-light': '#23233C',
        'navy-dark': '#12121F',
        gold: '#C9A84C',
        'gold-dark': '#B3923A',
        'gold-light': '#DCC476',
        cream: '#F8F5F0',
        'cream-dark': '#E7E1D7',
        ink: '#2D2D2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest: '0.18em',
        'wider-x': '0.28em',
      },
      boxShadow: {
        lift: '0 8px 28px rgba(26, 26, 46, 0.10)',
      },
    },
  },
  plugins: [],
}
