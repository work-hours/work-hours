import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { lactPreBuild } from './vendor/msamgan/lact/resources/methods';
import {run} from "vite-plugin-run";


export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        run([
            {
                name: "lact",
                build: false,
                run: ["php", "artisan", "lact:run"],
                pattern: ["routes/**/*.php", "app/**/Http/Controllers/**/*.php"],
            },
        ]),
        lactPreBuild()
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            '@actions': resolve(__dirname, 'vendor/msamgan/lact/resources/actions'),
            '@': resolve(__dirname, 'resources/js'),
        },
    },
});
