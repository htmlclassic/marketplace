/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'spin-fast': 'spin 0.6s linear infinite',
      },
      boxShadow: {
        'around': '0 0 4px 4px rgba(255, 255, 255, 0.4)'
      }
    },
  },
  plugins: [],
}
