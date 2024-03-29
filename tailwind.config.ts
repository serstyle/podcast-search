import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      spacing: {
        "25": "100px",
        "200": "800px",
      },
      maxWidth: {
        "200": "800px",
      },
    },
  },
  plugins: [],
} satisfies Config;
