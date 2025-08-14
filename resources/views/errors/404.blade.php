<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title>404 - Page Not Found | {{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/logo.png" sizes="any">
        <link rel="icon" href="/logo.png" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/logo.png">

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body class="font-sans antialiased">
        <div class="flex min-h-screen bg-background dark:bg-gray-900">
            {{-- Enhanced paper texture overlay with slightly increased opacity for better visibility --}}
            <div class="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA3Ii8+Cjwvc3ZnPg==')] opacity-100 dark:opacity-30"></div>

            {{-- Enhanced horizontal lines with significantly increased contrast --}}
            <div
                class="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:100%_2rem] dark:bg-[linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {{-- Enhanced vertical lines with significantly increased contrast --}}
            <div
                class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:2rem_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            <div class="flex flex-col items-center justify-center w-full px-4 py-16 mx-auto text-center">
                <div class="max-w-3xl mx-auto gap-6">
                    <h1 class="text-9xl font-bold text-gray-800 dark:text-gray-100">404</h1>
                    <h2 class="mt-4 text-3xl font-semibold text-gray-700 dark:text-gray-200">Page Not Found</h2>
                    <p class="mt-6 mb-6 text-lg text-gray-600 dark:text-gray-300">
                        Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
                    </p>
                    <div class="flex justify-center">
                        <a href="{{ url('/') }}" class="px-6 py-3 text-base font-medium text-white bg-primary border-2 border-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 shadow-lg">
                            Back to Home
                        </a>
                    </div>
                </div>

                <div class="mt-16 text-sm text-gray-500 dark:text-gray-400">
                    <p>© {{ date('Y') }} {{ config('app.name', 'Laravel') }}. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
</html>
