/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13161F",
        inksoft: "#4A5063",
        accent: "#3654D6",
        accentsoft: "#EEF1FC",
        line: "#E3E6EC",
      },
    },
  },
  plugins: [],
};
