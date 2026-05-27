import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#111827",
        ink: "#0f172a",
        amberbrand: "#f59e0b",
        nightblue: "#172554"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15,23,42,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
