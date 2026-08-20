/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/index.html', './client/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0E1A',
        'navy-light': '#0F1322',
        'navy-dark': '#060912',
        gold: '#C9A84C',
        'gold-dark': '#B3923A',
        'gold-light': '#DCC476',
        card: '#141927',
        'card-light': '#1A2033',
        text: '#F5F5F5',
        'text-dim': '#A0A8B8',
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
        lift: '0 8px 28px rgba(10, 14, 26, 0.40)',
      },
    },
  },
  plugins: [],
}
