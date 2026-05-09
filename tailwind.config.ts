import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Surfaces */
        paper: 'var(--paper)',
        linen: 'var(--linen)',
        vellum: 'var(--vellum)',
        rule: 'var(--rule)',

        /* Ink */
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        'ink-subtle': 'var(--ink-subtle)',

        /* Accents */
        sage: 'var(--sage)',
        'sage-soft': 'var(--sage-soft)',
        coral: 'var(--coral)',
        'coral-soft': 'var(--coral-soft)',
        amber: 'var(--amber)',
        'amber-soft-light': 'var(--amber-soft-light)',
        'amber-soft-dark': 'var(--amber-soft-dark)',
        indigo: 'var(--indigo)',

        /* Semantic */
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        destructive: 'var(--destructive)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-l': ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'display-m': ['2rem', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'title': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
        'subtitle': ['1.125rem', { lineHeight: '1.35' }],
        'body-l': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.45' }],
        'micro': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'mono': ['0.875rem', { lineHeight: '1.5' }],
        'vital': ['4rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      fontFamily: {
        'sans': ['var(--font-sans)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-serif)', 'serif'],
        'mono': ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        'touch': '3.5rem', /* 56px for tap targets */
      },
      minHeight: {
        'touch': '3.5rem',
      },
      minWidth: {
        'touch': '3.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
