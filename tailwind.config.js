/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mostar cinematic palette
        mostar: {
          sky: '#4a90a8',
          water: '#2c5f7c',
          stone: '#8b7355',
          sand: '#d4c5b0',
          cream: '#f5f0e8',
          dark: '#1a1a1a',
          warm: '#c9a87c',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cinematic': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'cinematic-fade': 'cinematicFade 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'cinematic-slide': 'cinematicSlide 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'parallax-slow': 'parallaxSlow 20s linear infinite',
      },
      keyframes: {
        cinematicFade: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cinematicSlide: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        parallaxSlow: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-20px)' },
        },
      }
    },
  },
  plugins: [],
}
