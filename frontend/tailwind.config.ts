import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--color-bg-base)',
          elevated: 'var(--color-bg-elevated)',
          overlay: 'var(--color-bg-overlay)',
        },
        fg: {
          primary: 'var(--color-fg-primary)',
          secondary: 'var(--color-fg-secondary)',
          muted: 'var(--color-fg-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          fg: 'var(--color-accent-fg)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        border: 'var(--color-border)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        enterUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
        enterUp: 'enterUp 500ms var(--ease-standard) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
