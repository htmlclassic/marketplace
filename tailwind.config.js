/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'spin-fast': 'spin 0.6s linear infinite',
        mainLoadingSpinnerAnimation:
          'animateMainLoadingSpinner 2s cubic-bezier(.39,.29,.5,.59) infinite forwards',
        'loading-bounce': 'loading-bounce .7s infinite'
      },

      keyframes: {
        animateMainLoadingSpinner: {
          '0%': { strokeDashoffset: '52' },
          '100%': { strokeDashoffset: '1500' }
        },

        'loading-bounce': {
          '0%': {
            'animation-timing-function': 'ease-in',
            'transform': 'translateY(0)'
          },
          '40%': {
            'animation-timing-function': 'ease-in',
            'transform': 'translateY(2rem) scaleY(1)'
          },
          '50%': {
            'animation-timing-function': 'ease-out',
            'transform': 'translateY(2rem) scaleY(.75)'
          },
          '60%': {
            'animation-timing-function': 'cubic-bezier(0,0,0,1)',
            'transform': 'translateY(2rem) scaleY(1)'
          },
          '100%': {
            'transform': 'translateY(0)'
          }
        }
      },

      boxShadow: {
        'around': '0 0 4px 4px rgba(255, 255, 255, 0.4)'
      }
    },
  },
  plugins: [],
}
