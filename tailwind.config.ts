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
                    DEFAULT: "#1254A3",
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#1254A3",
                    600: "#0d4282",
                    700: "#093366",
                    800: "#062347",
                    900: "#04172e",
                },
                secondary: {
                    DEFAULT: "#F39A32",
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde68a",
                    300: "#fcd34d",
                    400: "#fbbf24",
                    500: "#F39A32",
                    600: "#d97706",
                    700: "#b45309",
                    800: "#92400e",
                    900: "#78350f",
                },
                accent: {
                    DEFAULT: "#F39A32",
                },
                gov: {
                    navy: "#0B2545",
                    text: "#12304A",
                    bg: "#F5F7FA",
                    border: "#DDE3EA",
                    muted: "#5B738B",
                    blue: "#1254A3",
                    orange: "#F39A32",
                },
                gold: {
                    400: "#F39A32",
                    500: "#F39A32",
                }
            },
            fontFamily: {
                sans: ["Inter", "Montserrat", "system-ui", "sans-serif"],
                heading: ["Manrope", "Montserrat", "sans-serif"],
            },
            borderRadius: {
                gov: "10px",
            },
            boxShadow: {
                gov: "0 2px 8px rgba(18, 48, 74, 0.06), 0 1px 2px rgba(18, 48, 74, 0.04)",
                "gov-hover": "0 8px 24px rgba(18, 48, 74, 0.10), 0 2px 6px rgba(18, 48, 74, 0.06)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};

export default config;
