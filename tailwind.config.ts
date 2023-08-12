import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple-bg": "#F2F2FD",
        "purple-text": "#14134A",
        success: "#00C48C",
        danger: "#FF3D71",
        "purple-accent-1": "#6E6AF7",
        "purple-accent-2": "#8F8CF1",
        "blue-accent": "#6AB4F7",
      },
    },
  },
  plugins: [],
} satisfies Config;
