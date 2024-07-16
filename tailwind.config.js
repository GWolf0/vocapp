/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        dark:"#155E75",
        darker:"#164E63",
        darkest:"#083344",
        light:"#CFFAFE",
        lighter:"#ECFEFF",
        lightest:"#fff",
        primary:"#3B82F6",
        accent:"#0EA5E9",
        secondary:"#8B5CF6",
        semitrans:"rgba(1,1,1,0.25)",
        title:"beige",
        error:"#EF4444",
        warning:"#FBBF24",
        info:"#22C55E"
      }
    },
  },
  plugins: [],
}