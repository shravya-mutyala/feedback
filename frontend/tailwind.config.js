/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef4ff',
                    100: '#d9e6ff',
                    200: '#bcd4ff',
                    300: '#8eb8ff',
                    400: '#5991ff',
                    500: '#3b6ff6',
                    600: '#1e4fd8',
                    700: '#163dad',
                    800: '#112d6e',
                    900: '#0d1f4b',
                },
                navy: {
                    700: '#1a2744',
                    800: '#132038',
                    900: '#0f1a2e',
                },
            },
        },
    },
    plugins: [],
};
