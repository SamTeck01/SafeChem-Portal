/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#D1FAE5',
        },
        background: {
          light: '#FFFFFF',
          dark: '#111B21', // WhatsApp dark background
        },
        surface: {
          light: '#F7F9F9',
          dark: '#1F2C34', // WhatsApp surface/card color
        },
        card: {
          light: '#FFFFFF',
          dark: '#1F2C34',
        },
        border: {
          light: '#EFF3F4',
          dark: '#2A3942', // WhatsApp border color
        },
        textPrimary: {
          light: '#0F1419',
          dark: '#E9EDEF', // WhatsApp primary text
        },
        textSecondary: {
          light: '#536471',
          dark: '#8696A0', // WhatsApp secondary text
        },
      },
    },
  },
  plugins: [],
}
