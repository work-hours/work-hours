import AppLogoIcon from '@/components/app-logo-icon'
import { Link } from '@inertiajs/react'

export default function Footer() {
    return (
        <footer className="border-t border-gray-300/20 py-12 bg-[#f8f6e9]">
            {/* Typewriter footer with form-like elements */}
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="h-10 w-10 border border-gray-500/60 flex items-center justify-center bg-[#f8f6e9]/90">
                                <AppLogoIcon className="h-6 w-6 text-gray-700" />
                            </div>
                            <span className="text-lg font-bold text-gray-800 font-['Courier_New',monospace] uppercase tracking-wider">WorkHours</span>
                        </div>
                        <p className="mb-4 text-sm text-gray-700 font-['Courier_New',monospace]">
                            Simplifying time tracking for teams and individuals since 2025.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold text-gray-800 uppercase font-['Courier_New',monospace] border-b border-gray-400/30 pb-1">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link href="/" className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900">
                                    Home
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link href={route('login')} className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900">
                                    Login
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link
                                    href={route('register')}
                                    className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900"
                                >
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold text-gray-800 uppercase font-['Courier_New',monospace] border-b border-gray-400/30 pb-1">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link
                                    href={route('privacy-policy')}
                                    className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link
                                    href={route('terms-of-service')}
                                    className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link
                                    href={route('cookie-policy')}
                                    className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900"
                                >
                                    Cookie Policy
                                </Link>
                            </li>
                            {/*<li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link
                                    href={route('gdpr-compliance')}
                                    className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900"
                                >
                                    GDPR Compliance
                                </Link>
                            </li>*/}
                            <li className="flex items-center">
                                <span className="mr-2 text-gray-700/70">•</span>
                                <Link
                                    href={route('security')}
                                    className="text-gray-700 font-['Courier_New',monospace] hover:text-gray-900"
                                >
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-300/30 pt-8 text-center">
                    {/* Typewriter-style copyright with form line - more subtle */}
                    <div className="inline-block border border-gray-300/40 px-6 py-2 bg-[#f8f6e9]/90">
                        <p className="text-sm text-gray-700 font-['Courier_New',monospace]">
                            &copy; {new Date().getFullYear()} Work Hours. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
