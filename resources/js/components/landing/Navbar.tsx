import AppLogoIcon from '@/components/app-logo-icon'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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
        <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm dark:bg-gray-800">
            <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
                {/* Logo with timesheet-style container */}
                <Link href="/" className="flex items-center gap-3">
                    <AppLogoIcon className="h-20 w-20 text-gray-700 dark:text-gray-300" />
                    <div>
                        <span className="-ml-6 text-xl font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">Work Hours</span>
                        <div className="mt-1 -ml-6 h-1 w-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                </Link>

                {/* Desktop Navigation Menu */}
                <div className="hidden items-center space-x-8 md:flex">
                    {/* Features Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleFeaturesDropdown}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            Features
                            {featuresDropdownOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                        </button>

                        {/* Features Dropdown Menu */}
                        {featuresDropdownOpen && (
                            <div className="ring-opacity-5 absolute left-0 z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black dark:bg-gray-800">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <a
                                        href={isFeaturePage ? '/#features' : '#features'}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                        onClick={() => setFeaturesDropdownOpen(false)}
                                    >
                                        All Features
                                    </a>
                                    <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                                    <Link
                                        href="/features/time-tracking"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Time Tracking
                                    </Link>
                                    <Link
                                        href="/features/detailed-reports"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Detailed Reports
                                    </Link>
                                    <Link
                                        href="/features/team-collaboration"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Team Collaboration
                                    </Link>
                                    <Link
                                        href="/features/client-management"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Client Management
                                    </Link>
                                    <Link
                                        href="/features/bulk-upload"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Bulk Upload
                                    </Link>
                                    <Link
                                        href="/features/approval-management"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Approval Management
                                    </Link>
                                    <Link
                                        href="/features/currency-management"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Currency Management
                                    </Link>
                                    <Link
                                        href="/features/multi-currency-invoice"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Multi Currency Invoice
                                    </Link>
                                    <Link
                                        href="/features/task-management"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                        role="menuitem"
                                    >
                                        Task Management
                                    </Link>
                                    <Link
                                        href="/features/github-integration"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
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
                        className={`pb-1 text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400 ${activeHash === '#ai-section' ? 'border-b-2 border-primary' : ''}`}
                    >
                        AI Assistant
                    </a>
                    <a
                        href={isFeaturePage ? '/#how-it-works' : '#how-it-works'}
                        className={`pb-1 text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400 ${activeHash === '#how-it-works' ? 'border-b-2 border-primary' : ''}`}
                    >
                        How It Works
                    </a>
                    <a
                        href={isFeaturePage ? '/#cta' : '#cta'}
                        className={`pb-1 text-sm font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400 ${activeHash === '#cta' ? 'border-b-2 border-primary' : ''}`}
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="flex items-center rounded-md p-2 text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                        <span className="sr-only">Open main menu</span>
                        {/* Hamburger icon */}
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div className="absolute top-20 right-0 left-0 z-50 border border-gray-200 bg-white shadow-lg md:hidden dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {/* Mobile Features Menu */}
                            <div className="block px-3 py-2">
                                <button
                                    onClick={toggleFeaturesDropdown}
                                    className="flex w-full items-center justify-between text-base font-medium text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    <span>Features</span>
                                    {featuresDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>

                                {/* Mobile Features Dropdown */}
                                {featuresDropdownOpen && (
                                    <div className="mt-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                        <a
                                            href={isFeaturePage ? '/#features' : '#features'}
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            All Features
                                        </a>
                                        <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                                        <Link
                                            href="/features/time-tracking"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Time Tracking
                                        </Link>
                                        <Link
                                            href="/features/detailed-reports"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Detailed Reports
                                        </Link>
                                        <Link
                                            href="/features/team-collaboration"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Team Collaboration
                                        </Link>
                                        <Link
                                            href="/features/client-management"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Client Management
                                        </Link>
                                        <Link
                                            href="/features/bulk-upload"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Bulk Upload
                                        </Link>
                                        <Link
                                            href="/features/approval-management"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Approval Management
                                        </Link>
                                        <Link
                                            href="/features/currency-management"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Currency Management
                                        </Link>
                                        <Link
                                            href="/features/multi-currency-invoice"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Multi Currency Invoice
                                        </Link>
                                        <Link
                                            href="/features/task-management"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            Task Management
                                        </Link>
                                        <Link
                                            href="/features/github-integration"
                                            className="block py-2 text-sm text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400"
                                            onClick={toggleMobileMenu}
                                        >
                                            GitHub Integration
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <a
                                href={isFeaturePage ? '/#ai-section' : '#ai-section'}
                                className={`block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400 ${activeHash === '#ai-section' ? 'border-b-2 border-primary' : ''}`}
                                onClick={toggleMobileMenu}
                            >
                                AI Assistant
                            </a>
                            <a
                                href={isFeaturePage ? '/#how-it-works' : '#how-it-works'}
                                className={`block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400 ${activeHash === '#how-it-works' ? 'border-b-2 border-primary' : ''}`}
                                onClick={toggleMobileMenu}
                            >
                                How It Works
                            </a>
                            <a
                                href={isFeaturePage ? '/#cta' : '#cta'}
                                className={`block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400 ${activeHash === '#cta' ? 'border-b-2 border-primary' : ''}`}
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
                            className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-lg px-5 py-2 text-sm font-medium hover:bg-[#1d4ed8]"
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
                                className="relative z-10 inline-flex cursor-pointer items-center justify-center bg-primary text-primary-foreground rounded-lg px-5 py-2 text-sm font-medium hover:bg-[#1d4ed8]"
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
