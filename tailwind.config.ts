import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

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
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        'spin-fast': 'spin 0.6s linear infinite',
        mainLoadingSpinnerAnimation:
          'animateMainLoadingSpinner 2s cubic-bezier(.39,.29,.5,.59) infinite forwards',
        'loading-bounce': 'loading-bounce .7s infinite'
      },

      boxShadow: {
        'around': '0 0 4px 4px rgba(255, 255, 255, 0.4)'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config