import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "10px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        "grey-bg": "#F9FAFB",
        "dark-purple": "#1A105A",
        success: "#00C48C",
        danger: "#FF3D71",
        "purple-accent-1": "#6233D5",
        "purple-accent-2": "#A084E8",
        "blue-accent": "#6AB4F7",
      },
      fontFamily: {
        primary: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
