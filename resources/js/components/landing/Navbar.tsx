import AppLogoIcon from '@/components/app-logo-icon'
import { Link } from '@inertiajs/react'

export default function Navbar() {
    return (
        <nav className="container mx-auto flex items-center justify-between px-6 py-6 lg:px-8">
            <div className="flex items-center gap-2">
                <AppLogoIcon className="h-16 w-16 text-primary transition-all hover:scale-105" />
                <span className="text-xl font-bold tracking-tight text-foreground">Work Hours</span>
            </div>
            <div className="flex items-center gap-6 md:gap-8">
                <Link href={route('login')} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                    Sign in
                </Link>
                <Link
                    href={route('register')}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                    Get Started
                </Link>
            </div>
        </nav>
    )
}
