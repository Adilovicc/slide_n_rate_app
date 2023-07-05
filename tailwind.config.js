/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      aspectRatio:{
        'loginForm' : '12 / 16',
        'video': '16 / 9',
        'square':'1 / 1',
        'image':'14/10'
      },
      animation:{
        'pulse-slow':'pulse 2.6s infinite',
        'pulse-mid':'pulse 2.3s infinite',
        'ping-slow':'ping 2s infinite',
        'pulse-faster':'pulse 1.6s infinite',
        'pulse-fast':'pulse 1.2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens:{
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'xsm':'440px',
        'tscr':'350px',
      },
    },
  },
  plugins: [],
}
