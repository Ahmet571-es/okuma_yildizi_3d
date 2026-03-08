/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        star: {
          gold: '#FFD700',
          orange: '#FF8C00',
          pink: '#FF69B4',
          purple: '#8B5CF6',
          blue: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
        },
        world: {
          forest: '#2D5016',
          ocean: '#0E4D6F',
          desert: '#C2841A',
          ice: '#B8E0F7',
          sky: '#6C3FC5',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,215,0,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,215,0,0.8)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '75%': { transform: 'rotate(-15deg)' },
        },
      },
    },
  },
  plugins: [],
};
