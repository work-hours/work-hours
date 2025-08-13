import AppLogoIcon from '@/components/app-logo-icon'
import CookieConsent from '@/components/cookie-consent'
import Background from '@/components/ui/background'
import { Link } from '@inertiajs/react'
import { type PropsWithChildren } from 'react'

interface AuthLayoutProps {
    name?: string
    title?: string
    description?: string
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 dark:bg-gray-900">
            <Background />

            <div className="relative z-10 w-full max-w-md">
                {/* Card container - styled like a paper form */}
                <div className="relative border-2 border-gray-300 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                    {/* Timesheet header stamp */}
                    <div className="absolute -top-4 right-4 rotate-6 border-2 border-red-800/30 px-4 py-2 text-sm font-bold tracking-wider text-red-800/70 uppercase dark:border-red-400/30 dark:text-red-400/80">
                        Form
                    </div>

                    {/* Form header */}
                    <div className="mb-6 border-b border-gray-400/40 pb-4 dark:border-gray-600/40">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <Link href={route('home')} className="flex items-center gap-1">
                                    <AppLogoIcon className="h-20 w-20 text-gray-700 dark:text-gray-300" />
                                    <div>
                                        <span className="-ml-6 text-xl font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">
                                            Work Hours
                                        </span>
                                        <div className="mt-1 -ml-6 h-1 w-full bg-gray-300 dark:bg-gray-600"></div>
                                    </div>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold tracking-wide text-gray-800 uppercase dark:text-gray-200">{title}</h1>
                                    <p className="text-center text-sm text-gray-700 dark:text-gray-300">{description}</p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - styled like the landing page footer */}
            <div className="relative z-10 mt-8 text-center text-sm">
                <div className="mb-2">
                    <a
                        href="https://github.com/sponsors/msamgan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-gray-400 pb-1 text-gray-700 hover:border-gray-700 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100"
                    >
                        Sponsor this project
                    </a>
                </div>
                <div className="inline-block border border-gray-300/40 bg-[#f8f6e9]/90 px-4 py-1 dark:border-gray-700/40 dark:bg-gray-800/90">
                    <p className="text-sm text-gray-700 dark:text-gray-300">&copy; {new Date().getFullYear()} Work Hours. All rights reserved.</p>
                </div>
            </div>

            {/* Cookie Consent Banner */}
            <CookieConsent />
        </div>
    )
}
