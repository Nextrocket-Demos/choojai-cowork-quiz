import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,html}'],
  theme: {
    extend: {
      colors: {
        'choojai-bg':         '#FAF7F0',
        'choojai-green':      '#69B609',
        'choojai-green-dark': '#2D4A0A',
        'choojai-green-soft': '#F4F8E8',
        'zone-left':          '#FFF3E0',
        'zone-left-bd':       '#FF9F40',
        'zone-right':         '#E8F5E8',
        'zone-right-bd':      '#69B609',
      },
      fontFamily: {
        thai: ['"IBM Plex Sans Thai"', 'Sarabun', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
