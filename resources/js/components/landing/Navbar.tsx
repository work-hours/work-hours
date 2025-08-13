import AppLogoIcon from '@/components/app-logo-icon'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function Navbar() {
    const page = usePage()
    const { auth } = page.props as unknown as SharedData
    const currentPath = page.url
    const isFeaturePage = currentPath.startsWith('/features/')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false)
    const [activeHash, setActiveHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash : '')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const isLoggedIn = auth && auth.user

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    const toggleFeaturesDropdown = () => {
        setFeaturesDropdownOpen(!featuresDropdownOpen)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setFeaturesDropdownOpen(false)
            }
        }

        function handleHashChange() {
            setActiveHash(window.location.hash)
        }

        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('hashchange', handleHashChange)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [])

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <AppLogoIcon className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                    <span className="text-lg font-medium text-slate-900 dark:text-slate-100">Work Hours</span>
                </Link>

                <div className="hidden items-center space-x-6 md:flex">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleFeaturesDropdown}
                            className="flex items-center text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            Features
                            {featuresDropdownOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                        </button>

                        {featuresDropdownOpen && (
                            <div className="absolute left-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <a
                                        href={isFeaturePage ? '/#features' : '#features'}
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                        onClick={() => setFeaturesDropdownOpen(false)}
                                    >
                                        All Features
                                    </a>
                                    <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>
                                    <Link
                                        href="/features/time-tracking"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Time Tracking
                                    </Link>
                                    <Link
                                        href="/features/detailed-reports"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Detailed Reports
                                    </Link>
                                    <Link
                                        href="/features/team-collaboration"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Team Collaboration
                                    </Link>
                                    <Link
                                        href="/features/client-management"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Client Management
                                    </Link>
                                    <Link
                                        href="/features/bulk-upload"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Bulk Upload
                                    </Link>
                                    <Link
                                        href="/features/approval-management"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Approval Management
                                    </Link>
                                    <Link
                                        href="/features/currency-management"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Currency Management
                                    </Link>
                                    <Link
                                        href="/features/multi-currency-invoice"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Multi Currency Invoice
                                    </Link>
                                    <Link
                                        href="/features/task-management"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        Task Management
                                    </Link>
                                    <Link
                                        href="/features/github-integration"
                                        className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                        role="menuitem"
                                    >
                                        GitHub Integration
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <a
                        href={isFeaturePage ? '/#ai-section' : '#ai-section'}
                        className={`text-sm transition-colors ${
                            activeHash === '#ai-section'
                                ? 'text-slate-900 dark:text-slate-100'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        AI Assistant
                    </a>
                    <a
                        href={isFeaturePage ? '/#how-it-works' : '#how-it-works'}
                        className={`text-sm transition-colors ${
                            activeHash === '#how-it-works'
                                ? 'text-slate-900 dark:text-slate-100'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        How It Works
                    </a>
                    <a
                        href={isFeaturePage ? '/#cta' : '#cta'}
                        className={`text-sm transition-colors ${
                            activeHash === '#cta'
                                ? 'text-slate-900 dark:text-slate-100'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        Get Started
                    </a>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="flex items-center rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <span className="sr-only">Open main menu</span>
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="absolute top-16 right-0 left-0 z-50 border-b border-slate-200 bg-white shadow-lg md:hidden dark:border-slate-700 dark:bg-slate-900">
                        <div className="space-y-1 px-4 py-3">
                            {/* Mobile Features Menu */}
                            <div className="py-1">
                                <button
                                    onClick={toggleFeaturesDropdown}
                                    className="flex w-full items-center justify-between py-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <span>Features</span>
                                    {featuresDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>

                                {/* Mobile Features Dropdown */}
                                {featuresDropdownOpen && (
                                    <div className="mt-1 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-700">
                                        <a
                                            href={isFeaturePage ? '/#features' : '#features'}
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            All Features
                                        </a>
                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                                        <Link
                                            href="/features/time-tracking"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Time Tracking
                                        </Link>
                                        <Link
                                            href="/features/detailed-reports"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Detailed Reports
                                        </Link>
                                        <Link
                                            href="/features/team-collaboration"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Team Collaboration
                                        </Link>
                                        <Link
                                            href="/features/client-management"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Client Management
                                        </Link>
                                        <Link
                                            href="/features/bulk-upload"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Bulk Upload
                                        </Link>
                                        <Link
                                            href="/features/approval-management"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Approval Management
                                        </Link>
                                        <Link
                                            href="/features/currency-management"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Currency Management
                                        </Link>
                                        <Link
                                            href="/features/multi-currency-invoice"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Multi Currency Invoice
                                        </Link>
                                        <Link
                                            href="/features/task-management"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            Task Management
                                        </Link>
                                        <Link
                                            href="/features/github-integration"
                                            className="block py-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                            onClick={toggleMobileMenu}
                                        >
                                            GitHub Integration
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <a
                                href={isFeaturePage ? '/#ai-section' : '#ai-section'}
                                className={`block py-2 text-sm ${
                                    activeHash === '#ai-section'
                                        ? 'text-slate-900 dark:text-slate-100'
                                        : 'text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                                onClick={toggleMobileMenu}
                            >
                                AI Assistant
                            </a>
                            <a
                                href={isFeaturePage ? '/#how-it-works' : '#how-it-works'}
                                className={`block py-2 text-sm ${
                                    activeHash === '#how-it-works'
                                        ? 'text-slate-900 dark:text-slate-100'
                                        : 'text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                                onClick={toggleMobileMenu}
                            >
                                How It Works
                            </a>
                            <a
                                href={isFeaturePage ? '/#cta' : '#cta'}
                                className={`block py-2 text-sm ${
                                    activeHash === '#cta'
                                        ? 'text-slate-900 dark:text-slate-100'
                                        : 'text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                                onClick={toggleMobileMenu}
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {/* Appearance toggle with modern styling */}
                    <div className="relative z-10 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                        <AppearanceToggleDropdown />
                    </div>

                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                Sign in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
