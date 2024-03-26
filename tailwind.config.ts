import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono]
      },
      fontSize: {
        '2xs': '0.625rem'
      },
      animation: {
        'scale-in-content': 'scale-in-content 0.2s ease',
        'scale-out-content': 'scale-out-content 0.2s ease',
        'scale-in-dialog': 'scale-in-dialog 0.2s ease',
        'scale-out-dialog': 'scale-out-dialog 0.2s ease',
        'fade-in': 'fade-in 0.2s ease',
        'fade-out': 'fade-out 0.2s ease'
      },
      boxShadow: ({ colors }) => ({
        autofill: `inset 0 0 0 1000px ${colors.neutral[800]}`
      }),
      keyframes: {
        'scale-in-content': {
          '0%': { transform: 'rotateX(-30deg) scale(0.9)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg) scale(1)', opacity: '1' }
        },
        'scale-out-content': {
          '0%': { transform: 'rotateX(0deg) scale(1)', opacity: '1' },
          '100%': { transform: 'rotateX(-10deg) scale(0.9)', opacity: '0' }
        },
        'scale-in-dialog': {
          '0%': { transform: 'translate(-50%, -48%) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' }
        },
        'scale-out-dialog': {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -48%) scale(0.9)', opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      backgroundImage: {
        checkmark:
          'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS40NjcgMy43MjY5NkMxMS43NTU5IDMuOTE1ODYgMTEuODM3IDQuMzAzMiAxMS42NDgxIDQuNTkyMUw3LjM5ODExIDExLjA5MjFDNy4yOTc5NSAxMS4yNDUzIDcuMTM1NjggMTEuMzQ2OCA2Ljk1NDE0IDExLjM3QzYuNzcyNTkgMTEuMzkzMiA2LjU5MDAxIDExLjMzNTYgNi40NTQ1OCAxMS4yMTI1TDMuNzA0NTggOC43MTI1M0MzLjQ0OTE3IDguNDgwMzQgMy40MzAzNSA4LjA4NTA2IDMuNjYyNTQgNy44Mjk2NUMzLjg5NDczIDcuNTc0MjQgNC4yOTAwMSA3LjU1NTQxIDQuNTQ1NDIgNy43ODc2MUw2Ljc1MzA0IDkuNzk0NTNMMTAuNjAxOSAzLjkwODA0QzEwLjc5MDggMy42MTkxNCAxMS4xNzgxIDMuNTM4MDcgMTEuNDY3IDMuNzI2OTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)',
        noise:
          'url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjUwIDI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlRmlsdGVyIj4KICAgICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjIiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICAgIDwvZmlsdGVyPgogICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlRmlsdGVyKSIvPgogIDwvc3ZnPg==")'
      }
    }
  },
  plugins: [require('tailwindcss-radix'), require('@tailwindcss/typography'), require('@tailwindcss/forms')]
} satisfies Config
