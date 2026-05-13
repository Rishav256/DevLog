/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        surface: '#161b22',
        border: '#30363d',
        'text-primary': '#e6edf3',
        'text-muted': '#8b949e',
        accent: '#10b981',
        'accent-hover': '#059669',
        'accent-subtle': '#064e3b',
        error: '#f85149',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
