

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#121212',
        bgSecondary: '#1a1a1a',
        bgPanel: '#242424',
        bgCard: '#2a2a2a',
        textPrimary: '#ffffff',
        textSecondary: '#a0a0a0',
        textAccent: '#8ab4f8',
        borderColor: '#333333',
        primaryAccent: '#a8c7fa',
        primaryButton: '#a8c7fa',
        primaryButtonText: '#052e70',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
