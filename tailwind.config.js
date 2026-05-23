/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e3eaff',
          200: '#c5d0fc',
          300: '#a0b0f8',
          400: '#7a8df3',
          500: '#5e72eb',
          600: '#4a5dd4',
          700: '#3c4cba',
          800: '#3340a0',
          900: '#2d3885',
          950: '#1a2155',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        ink: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      boxShadow: {
        'glow':       '0 0 0 1px rgb(94 114 235 / 0.06), 0 4px 24px -2px rgb(94 114 235 / 0.10)',
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 16px 40px -16px rgb(0 0 0 / 0.10)',
        'inner-glow': 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(at 30% 20%, rgb(160 176 248 / 0.12) 0px, transparent 50%), radial-gradient(at 80% 80%, rgb(251 191 36 / 0.07) 0px, transparent 50%)',
        'mesh-dark':  'radial-gradient(at 20% 30%, rgb(60 76 186 / 0.22) 0px, transparent 50%), radial-gradient(at 80% 70%, rgb(180 83 9 / 0.12) 0px, transparent 50%)',
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease-out',
        'slide-up':    'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':    'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':     'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
