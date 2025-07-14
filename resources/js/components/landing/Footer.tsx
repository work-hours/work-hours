import AppLogoIcon from '@/components/app-logo-icon'
import { Link } from '@inertiajs/react'

export default function Footer() {
    return (
        <footer className="border-t border-border/40 py-12">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="animate-fade-up animate-once flex flex-col">
                        <div className="mb-4 flex items-center gap-2">
                            <AppLogoIcon className="h-10 w-10 text-primary transition-all hover:scale-110 hover:rotate-3" />
                            <span className="text-lg font-bold text-foreground">WorkHours</span>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">Simplifying time tracking for teams and individuals since 2025.</p>
                    </div>

                    <div className="animate-fade-up animate-once animate-delay-300">
                        <h3 className="mb-4 text-sm font-semibold text-foreground uppercase">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="transition-all hover:translate-x-1">
                                <Link href="/" className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li className="transition-all hover:translate-x-1">
                                <Link href={route('login')} className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
                                    Login
                                </Link>
                            </li>
                            <li className="transition-all hover:translate-x-1">
                                <Link
                                    href={route('register')}
                                    className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                >
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="animate-fade-up animate-once animate-delay-500">
                        <h3 className="mb-4 text-sm font-semibold text-foreground uppercase">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="transition-all hover:translate-x-1">
                                <Link
                                    href={route('privacy-policy')}
                                    className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="transition-all hover:translate-x-1">
                                <Link
                                    href={route('terms-of-service')}
                                    className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li className="transition-all hover:translate-x-1">
                                <Link
                                    href={route('cookie-policy')}
                                    className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                >
                                    Cookie Policy
                                </Link>
                            </li>
                            {/*<li className="transition-all hover:translate-x-1">
                                <Link
                                    href={route('gdpr-compliance')}
                                    className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                >
                                    GDPR Compliance
                                </Link>
                            </li>*/}
                            <li className="transition-all hover:translate-x-1">
                                <Link
                                    href={route('security')}
                                    className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                >
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border/40 pt-8 text-center">
                    <p className="animate-fade-up animate-once animate-delay-700 text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Work Hours. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
