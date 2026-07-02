import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D4AF37',
          600: '#C19B26',
          700: '#A87D1A',
          800: '#8B6310',
          900: '#713E08',
          950: '#3d1f04',
        },
        luxury: {
          black:   'rgb(var(--luxury-black) / <alpha-value>)',
          charcoal:'rgb(var(--luxury-charcoal) / <alpha-value>)',
          dark:    'rgb(var(--luxury-dark) / <alpha-value>)',
          surface: 'rgb(var(--luxury-surface) / <alpha-value>)',
          border:  'rgb(var(--luxury-border) / <alpha-value>)',
          muted:   'rgb(var(--luxury-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        mono:  ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-in-out',
        'fade-up':       'fadeUp 0.6s ease-out',
        'slide-in-right':'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'scale-in':      'scaleIn 0.4s ease-out',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 3s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
        'pulse-gold':    'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        slideInLeft: {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      backgroundImage: {
        'gradient-gold':       'linear-gradient(135deg, #D4AF37 0%, #F4CF53 50%, #C19B26 100%)',
        'gradient-dark':       'var(--gradient-dark)',
        'gradient-luxury':     'var(--gradient-luxury)',
        'gradient-hero':       'var(--gradient-hero)',
        'shimmer-gold':        'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 50%, transparent 100%)',
      },
      boxShadow: {
        'gold':       '0 4px 20px rgba(212, 175, 55, 0.3)',
        'gold-lg':    '0 8px 40px rgba(212, 175, 55, 0.4)',
        'gold-glow':  '0 0 30px rgba(212, 175, 55, 0.5)',
        'luxury':     'var(--shadow-luxury)',
        'luxury-sm':  'var(--shadow-luxury-sm)',
        'inner-gold': 'inset 0 1px 0 rgba(212, 175, 55, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
