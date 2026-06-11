import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EF9221",
        secondary: "#41B64B",
        admin: {
          bg: "#fafaf8",
          sidebar: "#ffffff",
          card: "#ffffff",
        },
      },
      boxShadow: {
        admin: "0 1px 3px rgba(65,182,75,0.05), 0 8px 24px rgba(239,146,33,0.08)",
      },
      borderRadius: {
        button: "12px",
        card: "20px",
      },
    }
  },
  plugins: []
};

export default config;
