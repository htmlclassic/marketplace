/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'spin-fast': 'spin 0.6s linear infinite',
        mainLoadingSpinnerAnimation:
          'animateMainLoadingSpinner 2s cubic-bezier(.39,.29,.5,.59) infinite forwards'
      },

      keyframes: {
        animateMainLoadingSpinner: {
          '0%': { strokeDashoffset: '52' },
          '100%': { strokeDashoffset: '1500' }
        }
      },

      boxShadow: {
        'around': '0 0 4px 4px rgba(255, 255, 255, 0.4)'
      }
    },
  },
  plugins: [],
}
