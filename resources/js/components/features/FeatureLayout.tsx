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
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
            <Head title={`${title} - Work Hours`} />
            <Navbar />

            <div className="container mx-auto px-6 pt-28 lg:px-8">
                <div className="mx-auto w-9/12">
                    <div className="rounded-lg border border-border/60 bg-card p-8 shadow-sm">
                        <div className="mb-6 flex items-center">
                            {icon && <div className="mr-4">{icon}</div>}
                            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
                        </div>
                        <div className="prose prose-lg max-w-none text-muted-foreground">
                            <div className="mt-6">{children}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
