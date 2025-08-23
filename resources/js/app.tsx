import { createInertiaApp } from '@inertiajs/react'
import { configureEcho } from '@laravel/echo-react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import GlobalLoader from './components/global-loader'
import { initializeTheme } from './hooks/use-appearance'

configureEcho({
    broadcaster: 'reverb',
})

const appName = import.meta.env.VITE_APP_NAME || 'Work Hours'

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el)

        root.render(
            <>
                <App {...props} />
                <GlobalLoader />
            </>,
        )
    },
    progress: false,
}).then()

initializeTheme()
