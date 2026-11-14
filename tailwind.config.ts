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
                    DEFAULT: "#EAB308",
                    50: "#fefce8",
                    100: "#fef9c3",
                    200: "#fef08a",
                    300: "#fde047",
                    400: "#facc15",
                    500: "#eab308",
                    600: "#ca8a04",
                    700: "#a16207",
                    800: "#854d0e",
                    900: "#713f12",
                },
                secondary: {
                    DEFAULT: "#003B73",
                    50: "#f0f7ff",
                    100: "#e0effe",
                    200: "#bae0fd",
                    300: "#7cc8fb",
                    400: "#36aaf5",
                    500: "#0072ce",
                    600: "#005bb5",
                    700: "#003b73",
                    800: "#002b5c",
                    900: "#06284f",
                },
                brasao: {
                    ouro: "#FACC15",
                    ouroDark: "#D97706",
                    safira: "#0072CE",
                    safiraDark: "#003B73",
                    agave: "#15803D",
                    agaveDark: "#064E3B",
                    terracota: "#EA580C",
                },
                accent: {
                    DEFAULT: "#003B73",
                },
                gov: {
                    gold: "#EAB308",
                    yellow: "#FACC15",
                    navy: "#002B5C",
                    blue: "#003B73",
                    text: "#0F2942",
                    bg: "#F8FAFC",
                    border: "#DCE4EE",
                    muted: "#526B84",
                    orange: "#EA580C",
                    green: "#15803D",
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
                "heraldic-hero": "linear-gradient(125deg, rgba(0, 43, 92, 0.94) 0%, rgba(0, 59, 115, 0.82) 48%, rgba(234, 179, 8, 0.45) 100%)",
            },
        },
    },
    plugins: [],
};

export default config;
