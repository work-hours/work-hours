/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./resources/**/*.{js,jsx,ts,tsx}', './resources/**/*.blade.php'],
    theme: {
        extend: {
            animation: {
                'background-shine': 'background-shine 8s linear infinite',
                'bounce-slow': 'bounce 3s ease-in-out infinite',
                'count-up': 'count-up 2s ease-out forwards',
                float: 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            keyframes: {
                'background-shine': {
                    from: {
                        backgroundPosition: '0 0',
                    },
                    to: {
                        backgroundPosition: '-200% 0',
                    },
                },
                'count-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                    },
                    '50%': {
                        transform: 'translateY(-10px)',
                    },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: '1',
                        boxShadow: '0 0 0 0 rgba(var(--color-primary), 0.7)',
                    },
                    '50%': {
                        opacity: '0.8',
                        boxShadow: '0 0 20px 10px rgba(var(--color-primary), 0.3)',
                    },
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}
