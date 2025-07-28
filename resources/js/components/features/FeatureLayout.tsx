import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import Background from '@/components/ui/background'
import { Head } from '@inertiajs/react'
import { ReactNode } from 'react'

interface FeatureLayoutProps {
    title: string
    icon?: ReactNode
    children: ReactNode
}

export default function FeatureLayout({ title, icon, children }: FeatureLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f8f6e9] dark:bg-gray-900" style={{ scrollBehavior: 'smooth' }}>
            <Background />
            <Head title={`${title} - Work Hours`} />
            <Navbar />

            <div className="pt-28">
                <div className="mx-auto w-9/12">
                    <div className="rounded-lg border-border/60 p-8">
                        <div className="mb-6 flex items-center">
                            {icon && <div className="mr-4">{icon}</div>}
                            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
                        </div>

                        {/* Beta Release Note */}
                        <div className="mb-6 rounded-md border border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-900/30">
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                This is a beta release, all the mentioned features may not be available at this moment.
                                Our Team is working hard to get missing features to you. Thanks for your patience.
                            </p>
                        </div>

                        <div className="prose prose-lg max-w-none text-muted-foreground">
                            <div className="mt-6">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative z-10 mx-auto w-full">
                <Footer />
            </div>
        </div>
    )
}
