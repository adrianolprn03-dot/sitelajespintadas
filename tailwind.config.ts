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
                    DEFAULT: "#01b0ef",
                    50: "#e0f8ff",
                    100: "#b3ecff",
                    200: "#80dfff",
                    300: "#4dd2ff",
                    400: "#1ac5ff",
                    500: "#01b0ef",
                    600: "#008cc0",
                    700: "#006890",
                    800: "#004461",
                    900: "#002131",
                },
                secondary: {
                    DEFAULT: "#FDB913",
                    50: "#fff9e7",
                    100: "#fef3cf",
                    200: "#fce79f",
                    300: "#fadb6f",
                    400: "#f8cf3f",
                    500: "#FDB913",
                    600: "#ca940f",
                    700: "#986f0b",
                    800: "#654a07",
                    900: "#332504",
                },
                gold: {
                    400: "#FDB913",
                    500: "#FDB913",
                }
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};

export default config;
