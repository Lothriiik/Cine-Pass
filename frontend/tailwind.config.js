/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Background & Texto
                background: '#E9D8C8',
                foreground: '#190207',

                // Cores da Marca
                primary: {
                    DEFAULT: '#7E2553',
                    hover: '#631B40',
                    foreground: '#E9D8C8',
                },
                secondary: {
                    DEFAULT: '#FF5C80',
                    hover: '#E5456A',
                    foreground: '#190207',
                },
                tertiary: {
                    DEFAULT: '#1A2744',
                    hover: '#111A2E',
                    foreground: '#E9D8C8',
                },

                // Semânticas
                success: {
                    DEFAULT: '#16A34A',
                    hover: '#15803D',
                },
                info: {
                    DEFAULT: '#3B82F6',
                    hover: '#2563EB',
                },
                warning: {
                    DEFAULT: '#DBA212',
                    hover: '#B5840D',
                },
                destructive: {
                    DEFAULT: '#DC2626',
                    hover: '#B91C1C',
                    foreground: '#FFFFFF',
                },

                // Superfícies (Surfaces)
                card: {
                    DEFAULT: '#F2E5D7',
                    hover: '#F8EDE1',
                    foreground: '#190207',
                },
                popover: {
                    DEFAULT: '#F7ECE1',
                    foreground: '#190207',
                },
                muted: {
                    DEFAULT: '#DECBB9',
                    foreground: '#4A353A',
                },
                accent: {
                    DEFAULT: '#D5C2B0',
                    foreground: '#190207',
                },

                // Bordas e Inputs
                border: '#190207',
                input: '#F2E5D7',
                ring: '#7E2553',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                lg: '0px',
                md: '0px',
                sm: '0px',
            },
            borderWidth: {
                DEFAULT: '2px',
                '0': '0px',
                '2': '2px',
                '4': '4px',
                '8': '8px',
            },
        },
    },
    plugins: [],
}