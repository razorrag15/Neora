/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        surface: {
          primary: 'var(--surface-primary)',
          elevated: 'var(--surface-elevated)',
          glass: 'var(--surface-glass)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        accent: {
          main: 'var(--accent-main)',
          secondary: 'var(--accent-secondary)',
          glow: 'var(--accent-glow)',
        },
        market: {
          gain: 'var(--gain-green)',
          loss: 'var(--loss-red)',
        },
        border: {
          light: 'var(--border-light)',
        }
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-main': 'var(--gradient-main)',
        'gradient-royal': 'var(--gradient-royal)',
      },
      boxShadow: {
        '3d': 'var(--shadow-3d)',
        'inner-light': 'var(--shadow-inner)',
        'glow': '0 0 20px var(--accent-glow)',
        'neon': '0 0 10px var(--accent-main), 0 0 20px var(--accent-secondary)',
      },
      animation: {
        'blob': 'blob 25s infinite alternate',
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-move': 'gridMove 60s linear infinite',
        'gradient-flow': 'gradientFlow 20s ease infinite',
        'marquee': 'marquee 60s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gridMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(60px)' },
        },
        gradientFlow: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333333%)' }
        }
      }
    }
  },
  plugins: [],
}