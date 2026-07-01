/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface': '#fff9eb',
        'on-surface': '#1e1c10',
        'on-surface-variant': '#42493e',
        'primary': '#154212',
        'primary-container': '#2d5a27',
        'tertiary': '#582d21',
        'on-tertiary': '#ffffff',
        'secondary': '#625e50',
        'surface-container-highest': '#e9e2d0',
        'surface-container-high': '#efe8d5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#faf3e0',
        'error': '#E34432',
      },
      fontFamily: {
        'headline-xl': ['"Playfair Display"', 'serif'],
        'headline-lg': ['"Playfair Display"', 'serif'],
        'body-md': ['"Hanken Grotesk"', 'sans-serif'],
        'body-sm': ['"Hanken Grotesk"', 'sans-serif'],
        'label-md': ['"Hanken Grotesk"', 'sans-serif'],
      },
      spacing: {
        'margin-mobile': '16px',
        'margin-desktop': '64px',
      }
    },
  },
  plugins: [],
};