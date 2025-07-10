import AppLogoIcon from '@/components/app-logo-icon'
import { Link } from '@inertiajs/react'

export default function Footer() {
    return (
        <footer className="border-t border-border/40 py-12">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col">
                        <div className="mb-4 flex items-center gap-2">
                            <AppLogoIcon className="h-10 w-10 text-primary" />
                            <span className="text-lg font-bold text-foreground">WorkHours</span>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">Simplifying time tracking for teams and individuals since 2023.</p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground uppercase">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href={route('login')} className="text-muted-foreground hover:text-primary">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href={route('register')} className="text-muted-foreground hover:text-primary">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground uppercase">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href={route('privacy-policy')} className="text-muted-foreground hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href={route('terms-of-service')} className="text-muted-foreground hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href={route('cookie-policy')} className="text-muted-foreground hover:text-primary">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href={route('gdpr-compliance')} className="text-muted-foreground hover:text-primary">
                                    GDPR Compliance
                                </Link>
                            </li>
                            <li>
                                <Link href={route('security')} className="text-muted-foreground hover:text-primary">
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border/40 pt-8 text-center">
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Work Hours. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
