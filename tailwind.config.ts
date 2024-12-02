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
      },
      fontFamily: {
        display: ["Clash Display"],
        serif: ["EB Garamond"],
      },
      keyframes: {
        "border-spin": {
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "prism-sequence": {
          // Jump animation (0-25%)
          "0%": { 
            transform: "translateY(0)" 
          },
          "10%": { 
            transform: "translateY(-10px)" 
          },
          "20%": { 
            transform: "translateY(0)" 
          },
          // Rotate animation (25-50%)
          "25%, 45%": { 
            transform: "rotate(0deg)" 
          },
          "35%": { 
            transform: "rotate(180deg)" 
          },
          // Turn/flip animation (50-75%)
          "50%, 70%": { 
            transform: "rotateY(0deg)" 
          },
          "60%": { 
            transform: "rotateY(180deg)" 
          },
          // Brief pause before repeating
          "75%, 100%": { 
            transform: "rotate(0deg) rotateY(0deg) translateY(0)" 
          }
        }
      },
      animation: {
        "border-spin": "border-spin 7s linear infinite",
        "prism-sequence": "prism-sequence 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;