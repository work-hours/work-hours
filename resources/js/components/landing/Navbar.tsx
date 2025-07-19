import AppLogoIcon from '@/components/app-logo-icon'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export default function Navbar() {
    const { auth } = usePage<SharedData>().props

    const isLoggedIn = auth && auth.user

    return (
        <nav className="container mx-auto flex items-center justify-between px-6 py-6 lg:px-8 relative z-20">
            {/* Logo with timesheet-style container */}
            <Link href="/" className="flex items-center gap-3">
                <div className="h-14 w-14 border-2 border-gray-700 flex items-center justify-center bg-white">
                    <AppLogoIcon className="h-8 w-8 text-gray-700" />
                </div>
                <div>
                    <span className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase tracking-wider">Work Hours</span>
                    <div className="h-1 w-full bg-gray-300 mt-1"></div>
                </div>
            </Link>

            <div className="flex items-center gap-6 md:gap-8">
                {/* Appearance toggle with paper-like styling */}
                <div className="border border-gray-400 p-1 bg-white cursor-pointer z-10 relative">
                    <AppearanceToggleDropdown />
                </div>

                {isLoggedIn ? (
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center bg-blue-900 px-5 py-2 text-sm font-bold text-white border-2 border-blue-900 hover:bg-blue-800 transition-colors font-['Courier_New',monospace]"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="text-sm font-bold text-gray-700 font-['Courier_New',monospace] hover:text-gray-900 border-b-2 border-gray-400 pb-1 hover:border-gray-700 cursor-pointer z-10 relative"
                        >
                            Sign in
                        </Link>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center bg-blue-900 px-5 py-2 text-sm font-bold text-white border-2 border-blue-900 hover:bg-blue-800 transition-colors font-['Courier_New',monospace] cursor-pointer z-10 relative"
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
