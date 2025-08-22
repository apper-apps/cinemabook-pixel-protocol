/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F5C518",
        secondary: "#1A1A2E", 
        accent: "#E94560",
        surface: "#16213E",
        background: "#0F0F1E",
        success: "#00D84A",
        warning: "#FFB800", 
        error: "#FF3333",
        info: "#00A8FF"
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}