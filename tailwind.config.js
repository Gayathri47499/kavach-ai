/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0B0F19",
          card: "#111827",
          border: "#1F2937",
          neon: "#00F0FF",
          danger: "#EF4444",
          warning: "#F59E0B",
          safe: "#10B981",
        },
      },
    },
  },
  plugins: [],
};
