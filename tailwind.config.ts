import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EBF5FF",
          500: "#1A5F7A",
          600: "#134B62",
          700: "#0D374A",
        },
        secondary: {
          500: "#159C4B",
          600: "#117A3A",
        },
        accent: {
          500: "#D4621A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
