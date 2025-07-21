import AppLogoIcon from '@/components/app-logo-icon'
import { Link } from '@inertiajs/react'

export default function Footer() {
    return (
        <footer className="border-t border-gray-300/20 bg-[#f8f6e9] py-12 dark:border-gray-700/20 dark:bg-gray-900">
            {/* Typewriter footer with form-like elements */}
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center border border-gray-500/60 bg-[#f8f6e9]/90 dark:border-gray-600/60 dark:bg-gray-800/90">
                                <AppLogoIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            </div>
                            <span className="text-lg font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">WorkHours</span>
                        </div>
                        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                            Simplifying time tracking for teams and individuals since 2025.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 border-b border-gray-400/30 pb-1 text-sm font-bold text-gray-800 uppercase dark:border-gray-600/30 dark:text-gray-200">
                            Company
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                                    Home
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link href={route('login')} className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                                    Login
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link
                                    href={route('register')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                                >
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 border-b border-gray-400/30 pb-1 text-sm font-bold text-gray-800 uppercase dark:border-gray-600/30 dark:text-gray-200">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link
                                    href={route('privacy-policy')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link
                                    href={route('terms-of-service')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link
                                    href={route('cookie-policy')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                                >
                                    Cookie Policy
                                </Link>
                            </li>
                            {/*<li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link
                                    href={route('gdpr-compliance')}
                                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                >
                                    GDPR Compliance
                                </Link>
                            </li>*/}
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70 dark:text-gray-400/70">•</span>
                                <Link
                                    href={route('security')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                                >
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-300/30 pt-8 text-center dark:border-gray-700/30">
                    {/* Typewriter-style copyright with form line - more subtle */}
                    <div className="inline-block border border-gray-300/40 bg-[#f8f6e9]/90 px-6 py-2 dark:border-gray-700/40 dark:bg-gray-800/90">
                        <p className="text-sm text-gray-700 dark:text-gray-300">&copy; {new Date().getFullYear()} Work Hours. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
