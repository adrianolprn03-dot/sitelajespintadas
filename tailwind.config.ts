import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0072CE",
                    50: "#f0f7ff",
                    100: "#e0effe",
                    200: "#bae0fd",
                    300: "#7cc8fb",
                    400: "#36aaf5",
                    500: "#0072CE",
                    600: "#005bb5",
                    700: "#004B87",
                    800: "#003B73",
                    900: "#06284F",
                },
                secondary: {
                    DEFAULT: "#EA580C",
                    50: "#fff7ed",
                    100: "#ffedd5",
                    200: "#fed7aa",
                    300: "#fdba74",
                    400: "#fb923c",
                    500: "#EA580C",
                    600: "#c2410c",
                    700: "#9a3412",
                    800: "#7c2d12",
                    900: "#431407",
                },
                brasao: {
                    safira: "#0072CE",
                    safiraDark: "#003B73",
                    agave: "#15803D",
                    agaveDark: "#064E3B",
                    terracota: "#EA580C",
                    ouro: "#FACC15",
                    ouroDark: "#D97706",
                },
                accent: {
                    DEFAULT: "#FACC15",
                },
                gov: {
                    navy: "#003B73",
                    text: "#0F2942",
                    bg: "#F4F7FB",
                    border: "#DCE4EE",
                    muted: "#526B84",
                    blue: "#0072CE",
                    orange: "#EA580C",
                    green: "#15803D",
                    gold: "#FACC15",
                },
                gold: {
                    400: "#FACC15",
                    500: "#EAB308",
                }
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                heading: ["Plus Jakarta Sans", "Manrope", "Inter", "sans-serif"],
            },
            borderRadius: {
                gov: "14px",
            },
            boxShadow: {
                gov: "0 4px 16px rgba(0, 59, 115, 0.06), 0 1px 3px rgba(0, 59, 115, 0.04)",
                "gov-hover": "0 12px 32px rgba(0, 59, 115, 0.12), 0 4px 10px rgba(0, 59, 115, 0.06)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "heraldic-hero": "linear-gradient(125deg, rgba(0, 45, 98, 0.92) 0%, rgba(0, 91, 181, 0.80) 48%, rgba(234, 88, 12, 0.55) 100%)",
            },
        },
    },
    plugins: [],
};

export default config;
