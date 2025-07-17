import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '4k-portrait': { raw: '(min-width: 2000px) and (orientation: portrait)' },
        '4k-landscape': { raw: '(min-width: 3000px) and (orientation: landscape)' },
      },
    },
  },
  plugins: [],
};

export default config;
