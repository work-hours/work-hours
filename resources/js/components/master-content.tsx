import { HourlyRateStatusBar } from '@/components/hourly-rate-status-bar'
import { type BreadcrumbItem } from '@/types'
import { Link } from '@inertiajs/react'
import { ChevronRight, Home } from 'lucide-react'
import { type ReactNode, type Dispatch, type SetStateAction } from 'react'

interface MasterContentProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
    collapsed: boolean
    setCollapsed: Dispatch<SetStateAction<boolean>>
}

export function MasterContent({ children, breadcrumbs = [], collapsed, setCollapsed }: MasterContentProps) {
    return (
        <div className="flex flex-col flex-1 bg-[#f8f6e9] font-['Courier_New',monospace] relative">
            {/* Horizontal lines like a timesheet */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem]"
                aria-hidden="true"
            ></div>

            {/* Vertical lines like a timesheet */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%]"
                aria-hidden="true"
            ></div>

            {/* Punch card holes */}
            <div
                className="pointer-events-none absolute top-0 bottom-0 left-4 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y"
                aria-hidden="true"
            ></div>

            {/* Header with breadcrumbs */}
            <div className="border-b border-gray-300 bg-white p-4 shadow-sm relative z-10">
                <div className="flex items-center">
                    <div className="flex items-center relative">
                        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                            <Home className="h-5 w-5" />
                        </Link>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="ml-2 rounded-md p-1 transition-colors hover:bg-gray-200"
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="13 17 18 12 13 7"></polyline>
                                    <polyline points="6 17 11 12 6 7"></polyline>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="11 17 6 12 11 7"></polyline>
                                    <polyline points="18 17 13 12 18 7"></polyline>
                                </svg>
                            )}
                        </button>
                    </div>
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
            <main className="container mx-auto flex-1 overflow-y-auto relative z-10">

                {/* Hourly rate status bar */}
                <HourlyRateStatusBar />

                {/* Content */}
                <div className="p-4">{children}</div>
            </main>
        </div>

    )
}
