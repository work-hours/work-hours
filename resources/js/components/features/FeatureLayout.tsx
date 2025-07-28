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
        <div className="min-h-screen bg-[#f8f6e9] dark:bg-gray-900">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-100 dark:opacity-30"></div>

            {/* Horizontal lines like a timesheet */}
            <div
                className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem] dark:bg-[linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Vertical lines like a timesheet */}
            <div
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Punch card holes */}
            <div
                className="absolute top-0 bottom-0 left-4 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_3px,transparent_3px)]"
                aria-hidden="true"
            ></div>

            {/* Red margin line */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-red-400/30 dark:bg-red-500/20" aria-hidden="true"></div>
            <Head title={`${title} - Work Hours`} />
            <Navbar />

            <div className="pt-28">
                <div className="mx-auto w-9/12">
                    <div className="rounded-lg border-border/60 p-8">
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
