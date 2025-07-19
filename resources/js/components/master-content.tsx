import { type BreadcrumbItem } from '@/types'
import { type ReactNode } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { HourlyRateStatusBar } from '@/components/hourly-rate-status-bar'

interface MasterContentProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export function MasterContent({ children, breadcrumbs = [] }: MasterContentProps) {
    return (
        <main className="flex-1 overflow-y-auto">
            {/* Header with breadcrumbs */}
            <div className="border-b border-gray-300 bg-white p-4 shadow-sm">
                <div className="flex items-center">
                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                        <Home className="h-5 w-5" />
                    </Link>
                    {breadcrumbs.length > 0 && (
                        <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                    )}
                    {breadcrumbs.map((breadcrumb, index) => (
                        <div key={breadcrumb.href} className="flex items-center">
                            {breadcrumb.href ? (
                                <Link
                                    href={breadcrumb.href}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 font-['Courier_New',monospace]"
                                >
                                    {breadcrumb.title}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium text-gray-900 font-['Courier_New',monospace]">
                                    {breadcrumb.title}
                                </span>
                            )}
                            {index < breadcrumbs.length - 1 && (
                                <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hourly rate status bar */}
            <HourlyRateStatusBar />

            {/* Content */}
            <div className="p-4">
                {children}
            </div>
        </main>
    )
}
