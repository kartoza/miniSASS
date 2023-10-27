module.exports = {
  mode: "jit",
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        blue: { 900: "#0e4981" },
        cyan: { A200: "#00ffff" },
        gray: {
          200: "#e7e7e7",
          500: "#a2a2a2",
          800: "#414141",
          "500_01": "#939090",
        },
        blue_gray: { 100: "#d9d9d9", 500: "#539987" },
        red: { 500: "#ea4832", A700: "#d00501" },
        green: { 800: "#288b31" },
        yellow: { 400: "#fadf63" },
        black: { 900: "#000000", "900_01": "#070707" },
        white: { A700: "#ffffff" },
        indigo: { 800: "#2f3a80" },
      },
      fontFamily: { raleway: "Raleway" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
