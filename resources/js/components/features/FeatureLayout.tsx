import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Head } from '@inertiajs/react'
import { ReactNode } from 'react'

interface FeatureLayoutProps {
    title: string
    icon?: ReactNode
    children: ReactNode
}

export default function FeatureLayout({ title, icon, children }: FeatureLayoutProps) {
    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900" style={{ scrollBehavior: 'smooth' }}>
            <div className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-900/80">
                <Navbar />
            </div>
            <Head title={`${title} - Work Hours`} />

            <div className="pt-20 pb-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
                        <div className="mb-8 flex items-center">
                            {icon && <div className="mr-4 rounded-full bg-slate-100 p-3 dark:bg-slate-700">{icon}</div>}
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">{title}</h1>
                        </div>

                        {/* Beta Release Note */}
                        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/20">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                This is a beta release, all the mentioned features may not be available at this moment. Our Team is working hard to
                                get missing features to you. Thanks for your patience.
                            </p>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                            <div className="mt-6">{children}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full bg-white dark:bg-gray-800">
                <Footer />
            </div>
        </div>
    )
}
