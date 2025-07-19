import AppLogoIcon from '@/components/app-logo-icon'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export default function Navbar() {
    const { auth } = usePage<SharedData>().props

    const isLoggedIn = auth && auth.user

    return (
        <nav className="relative z-20 container mx-auto flex items-center justify-between px-6 py-6 lg:px-8">
            {/* Logo with timesheet-style container */}
            <Link href="/" className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center border-2 border-gray-700 bg-white">
                    <AppLogoIcon className="h-8 w-8 text-gray-700" />
                </div>
                <div>
                    <span className="font-['Courier_New',monospace] text-xl font-bold tracking-wider text-gray-800 uppercase">Work Hours</span>
                    <div className="mt-1 h-1 w-full bg-gray-300"></div>
                </div>
            </Link>

            <div className="flex items-center gap-6 md:gap-8">
                {/* Appearance toggle with paper-like styling */}
                <div className="relative z-10 cursor-pointer border border-gray-400 bg-white p-1">
                    <AppearanceToggleDropdown />
                </div>

                {isLoggedIn ? (
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center border-2 border-blue-900 bg-blue-900 px-5 py-2 font-['Courier_New',monospace] text-sm font-bold text-white transition-colors hover:bg-blue-800"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="relative z-10 cursor-pointer border-b-2 border-gray-400 pb-1 font-['Courier_New',monospace] text-sm font-bold text-gray-700 hover:border-gray-700 hover:text-gray-900"
                        >
                            Sign in
                        </Link>
                        <Link
                            href={route('register')}
                            className="relative z-10 inline-flex cursor-pointer items-center justify-center border-2 border-blue-900 bg-blue-900 px-5 py-2 font-['Courier_New',monospace] text-sm font-bold text-white transition-colors hover:bg-blue-800"
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
