import AppLogoIcon from '@/components/app-logo-icon'
import CookieConsent from '@/components/cookie-consent'
import { Link } from '@inertiajs/react'
import { type PropsWithChildren } from 'react'

interface AuthLayoutProps {
    name?: string
    title?: string
    description?: string
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50 p-6 md:p-8 dark:bg-slate-900">
            <div className="w-full max-w-md">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-md dark:border-gray-800 dark:bg-gray-800">
                    <div className="mb-8">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <Link href={route('home')} className="flex items-center gap-1">
                                    <AppLogoIcon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <span className="-ml-4 text-xl font-bold tracking-wide text-gray-900 dark:text-white">Work Hours</span>
                                        <div className="mt-1 -ml-4 h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                                    </div>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                                    <p className="text-center text-gray-600 dark:text-gray-300">{description}</p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-sm">
                <div className="mb-4">
                    <a
                        href="https://github.com/sponsors/msamgan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                        Sponsor this project
                    </a>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} Work Hours. All rights reserved.</p>
            </div>

            <CookieConsent />
        </div>
    )
}
