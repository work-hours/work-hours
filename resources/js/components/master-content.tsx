import { HourlyRateStatusBar } from '@/components/hourly-rate-status-bar'
import { type BreadcrumbItem } from '@/types'
import { Link } from '@inertiajs/react'
import { ChevronRight, Home } from 'lucide-react'
import { type ReactNode } from 'react'

interface MasterContentProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export function MasterContent({ children, breadcrumbs = [] }: MasterContentProps) {
    return (
        <div className="flex flex-col flex-1 bg-[#f8f6e9] font-['Courier_New',monospace]">
            {/* Header with breadcrumbs */}
            <div className="border-b border-gray-300 bg-white p-4 shadow-sm">
                <div className="flex items-center">
                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                        <Home className="h-5 w-5" />
                    </Link>
                    {breadcrumbs.length > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
                    {breadcrumbs.map((breadcrumb, index) => (
                        <div key={breadcrumb.href} className="flex items-center">
                            {breadcrumb.href ? (
                                <Link
                                    href={breadcrumb.href}
                                    className="font-['Courier_New',monospace] text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    {breadcrumb.title}
                                </Link>
                            ) : (
                                <span className="font-['Courier_New',monospace] text-sm font-medium text-gray-900">{breadcrumb.title}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
                        </div>
                    ))}
                </div>
            </div>
            <main className="container mx-auto flex-1 overflow-y-auto">


                {/* Hourly rate status bar */}
                <HourlyRateStatusBar />

                {/* Content */}
                <div className="p-4">{children}</div>
            </main>
        </div>

    )
}
