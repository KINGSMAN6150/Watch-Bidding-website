/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: '#13131a',
        elevated: '#1a1a24',
        accent: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
          glow: '#a855f7',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
        border: '#2d2d3d',
        success: '#10b981',
        danger: '#ef4444',
        muted: '#94a3b8',
        foreground: '#f1f5f9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'accent-gradient': 'linear-gradient(135deg, #7c3aed, #a855f7)',
      },
      boxShadow: {
        'accent-glow': '0 0 20px rgba(124, 58, 237, 0.4)',
        'gold-glow': '0 0 16px rgba(245, 158, 11, 0.35)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
