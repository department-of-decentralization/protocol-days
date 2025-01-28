import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#e2382a",
          50: "#fef2f2",
          100: "#fde3e2",
          200: "#fbcac7",
          300: "#f7a6a1",
          400: "#f27971",
          500: "#e2382a",
          600: "#cc2820",
          700: "#ab1f1a",
          800: "#8c1c19",
          900: "#741b19",
          950: "#400a09",
        },
        default: "#e2382a",
      },
    },
  },
  plugins: [],
} satisfies Config;
