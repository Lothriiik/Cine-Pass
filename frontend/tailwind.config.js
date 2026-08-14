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
                // Background & Texto da página
                background: 'rgb(var(--background-rgb) / <alpha-value>)',
                foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',

                // Cores constantes da paleta
                'light-cream': 'rgb(var(--light-cream-rgb) / <alpha-value>)',
                'dark-void': 'rgb(var(--dark-void-rgb) / <alpha-value>)',

                // Cores da Marca
                primary: {
                    DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--primary-hover-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--primary-foreground-rgb) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--secondary-hover-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--secondary-foreground-rgb) / <alpha-value>)',
                },
                tertiary: {
                    DEFAULT: 'rgb(var(--tertiary-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--tertiary-hover-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--tertiary-foreground-rgb) / <alpha-value>)',
                },

                // Semânticas
                success: {
                    DEFAULT: 'rgb(var(--success-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--success-rgb) / 0.85)',
                },
                info: {
                    DEFAULT: 'rgb(var(--info-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--info-rgb) / 0.85)',
                },
                warning: {
                    DEFAULT: 'rgb(var(--warning-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--warning-rgb) / 0.85)',
                },
                destructive: {
                    DEFAULT: 'rgb(var(--destructive-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--destructive-rgb) / 0.85)',
                    foreground: '#FFFFFF',
                },

                // Superfícies (Surfaces)
                card: {
                    DEFAULT: 'rgb(var(--card-rgb) / <alpha-value>)',
                    hover: 'rgb(var(--accent-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
                },
                popover: {
                    DEFAULT: 'rgb(var(--popover-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
                },
                muted: {
                    DEFAULT: 'rgb(var(--muted-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--foreground-rgb) / 0.7)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
                    foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
                },

                // Bordas e Inputs
                border: 'rgb(var(--border-rgb) / <alpha-value>)',
                input: 'rgb(var(--card-rgb) / <alpha-value>)',
                ring: 'rgb(var(--primary-rgb) / <alpha-value>)',
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