import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import ReactDOMServer from 'react-dom/server'
import { type RouteName, route } from 'ziggy-js'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
        setup: ({ App, props }) => {
            /* eslint-disable */

            ;(globalThis as any).route = (name: RouteName, params?: unknown, absolute?: boolean) =>
                route(name as any, params as any, absolute as any, {
                    ...((page.props as any).ziggy as any),
                    location: new URL(((page.props as any).ziggy as any).location as string),
                })
            /* eslint-enable */

            return <App {...props} />
        },
    }),
)
