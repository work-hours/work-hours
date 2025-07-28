import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import Background from '@/components/ui/background'
import { Head, Link } from '@inertiajs/react'
import { ReactNode } from 'react'

interface LegalLayoutProps {
    title: string
    children: ReactNode
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
    const legalPages = [
        { name: 'Privacy Policy', route: 'privacy-policy' },
        { name: 'Terms of Service', route: 'terms-of-service' },
        { name: 'Cookie Policy', route: 'cookie-policy' },
        { name: 'GDPR Compliance', route: 'gdpr-compliance' },
        { name: 'Security', route: 'security' },
    ]

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f8f6e9] dark:bg-gray-900" style={{ scrollBehavior: 'smooth' }}>
            <Background />
            <Head title={`${title} - Work Hours`} />
            <Navbar />

            <div className="pt-28">
                <div className="mx-auto w-9/12">
                    <div className="rounded-lg border-border/60 p-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            {/* Sidebar Navigation */}
                            <div className="md:col-span-1">
                                <div className="sticky top-8 rounded-lg border border-border/60 bg-card p-6 shadow-sm">
                                    <h3 className="mb-4 text-lg font-semibold text-foreground">Legal Documents</h3>
                                    <nav className="space-y-2">
                                        {legalPages.map((page) => (
                                            <Link
                                                key={page.route}
                                                href={route(page.route)}
                                                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                                    route().current(page.route)
                                                        ? 'bg-primary/10 font-medium text-primary'
                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                            >
                                                {page.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <main className="md:col-span-3">
                                <div className="rounded-lg border border-border/60 bg-card p-8 shadow-sm">
                                    <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
                                    <div className="prose prose-lg max-w-none text-muted-foreground">
                                        <p className="text-sm text-muted-foreground/80">Last updated: {new Date().toLocaleDateString()}</p>
                                        <div className="mt-6">{children}</div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
