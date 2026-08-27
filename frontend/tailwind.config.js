/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: '#121824',
          border: '#1e293b',
          accent: '#00f0ff',
          purple: '#7000ff',
          neon: '#39ff14',
          pink: '#ff007f',
          gold: '#ffb703',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 240, 255, 0.35)',
        purple: '0 0 20px rgba(112, 0, 255, 0.35)',
      },
    },
  },
  plugins: [],
};
