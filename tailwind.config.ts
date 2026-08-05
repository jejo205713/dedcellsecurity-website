import type { Config } from 'tailwindcss';

/**
 * Design tokens ported verbatim from the live site's Tailwind CDN config
 * (dedcell-security/public/index.html:59-87) plus its <style> block.
 *
 * Two things to know before changing anything here:
 *
 *  1. **The site is light, not dark.** DESIGN_SPEC.md described a pure-black
 *     theme; the live site was flipped to white (`body { background:#fff }`)
 *     with individually inverted dark sections. Trust this file, not that doc.
 *  2. **There are no accent colours.** Emphasis is carried entirely by
 *     black/white/gray and 1px hairline borders. If you reach for a colour, the
 *     answer is a border, a weight change, or an inverted block.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        surface: '#f5f5f5',
        surfaceDark: '#f0f0f0',
        inputBg: '#fafafa',
        gray: {
          300: '#c0c0c0',
          400: '#909090',
          500: '#606060',
          600: '#404040',
          700: '#303030',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.1em',
      },
      typography: () => ({
        /**
         * `prose-dedcell`. The plugin's defaults assume a generic light theme
         * with coloured links; retune them so an article body reads as the same
         * design system as the marketing pages.
         */
        dedcell: {
          css: {
            '--tw-prose-body': '#606060',
            '--tw-prose-headings': '#000000',
            '--tw-prose-lead': '#606060',
            '--tw-prose-links': '#000000',
            '--tw-prose-bold': '#000000',
            '--tw-prose-counters': '#909090',
            '--tw-prose-bullets': '#c0c0c0',
            '--tw-prose-hr': 'rgba(0,0,0,0.1)',
            '--tw-prose-quotes': '#000000',
            '--tw-prose-quote-borders': 'rgba(0,0,0,0.1)',
            '--tw-prose-captions': '#909090',
            '--tw-prose-code': '#000000',
            '--tw-prose-pre-code': '#c0c0c0',
            '--tw-prose-pre-bg': '#000000',
            '--tw-prose-th-borders': 'rgba(0,0,0,0.1)',
            '--tw-prose-td-borders': 'rgba(0,0,0,0.1)',
            // Headings use the display face, matching h1-h4 sitewide.
            'h2, h3, h4': {
              fontFamily: 'var(--font-display), "Space Grotesk", sans-serif',
              letterSpacing: '-0.02em',
              color: '#000000',
            },
            // Links are underlined, never coloured — there is no accent colour.
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgba(0,0,0,0.25)',
              fontWeight: '500',
              '&:hover': { textDecorationColor: '#000000' },
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              fontWeight: '400',
              backgroundColor: 'rgba(0,0,0,0.04)',
              padding: '0.15em 0.35em',
              borderRadius: '0.25rem',
            },
            img: { borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.1)' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
