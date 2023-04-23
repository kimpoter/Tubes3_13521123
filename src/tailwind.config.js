/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite",
      },
    },
  },
  plugins: [],
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--gradient-color-stops))",
    },
  },
};
