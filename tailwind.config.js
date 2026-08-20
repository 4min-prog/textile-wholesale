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
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
