import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        zero: '0'
      },
    },
  },
  plugins: [],
} satisfies Config;
