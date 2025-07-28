import AppLogoIcon from '@/components/app-logo-icon'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function Navbar() {
    const { auth } = usePage<SharedData>().props
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isLoggedIn = auth && auth.user

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    return (
        <nav className="relative z-20 container mx-auto flex items-center justify-between px-6 py-6 lg:px-8">
            {/* Logo with timesheet-style container */}
            <Link href="/" className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center border-2 border-gray-700 bg-white dark:border-gray-400 dark:bg-gray-800">
                    <AppLogoIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                    <span className="text-xl font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">Work Hours</span>
                    <div className="mt-1 h-1 w-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
            </Link>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
                <a
                    href="#features"
                    className="text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                >
                    Features
                </a>
                <a
                    href="#ai-section"
                    className="text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                >
                    AI Assistant
                </a>
                <a
                    href="#how-it-works"
                    className="text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                >
                    How It Works
                </a>
                <a
                    href="#cta"
                    className="text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                >
                    Get Started
                </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
                <button
                    onClick={toggleMobileMenu}
                    className="flex items-center p-2 rounded-md text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                >
                    <span className="sr-only">Open main menu</span>
                    {/* Hamburger icon */}
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
                <div className="absolute top-20 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a
                            href="#features"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
                            onClick={toggleMobileMenu}
                        >
                            Features
                        </a>
                        <a
                            href="#ai-section"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
                            onClick={toggleMobileMenu}
                        >
                            AI Assistant
                        </a>
                        <a
                            href="#how-it-works"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
                            onClick={toggleMobileMenu}
                        >
                            How It Works
                        </a>
                        <a
                            href="#cta"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
                            onClick={toggleMobileMenu}
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-6 md:gap-8">
                {/* Appearance toggle with paper-like styling */}
                <div className="relative z-10 cursor-pointer border border-gray-400 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
                    <AppearanceToggleDropdown />
                </div>

                {isLoggedIn ? (
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center border-2 border-blue-900 bg-blue-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-800 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="relative z-10 cursor-pointer border-b-2 border-gray-400 pb-1 text-sm font-bold text-gray-700 hover:border-gray-700 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100"
                        >
                            Sign in
                        </Link>
                        <Link
                            href={route('register')}
                            className="relative z-10 inline-flex cursor-pointer items-center justify-center border-2 border-blue-900 bg-blue-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-800 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
