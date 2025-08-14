import Background from '@/components/ui/background'
import { Head, Link } from '@inertiajs/react'
import { ChevronLeft, ChevronRight, LayoutDashboard, Settings, Users } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'

interface AdminLayoutProps {
    children: ReactNode
    title?: string
}

export default function AdminLayout({ children, title = 'Admin' }: AdminLayoutProps) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('admin_sidebar_collapsed')
            return savedState === 'true'
        }
        return false
    })

    const [pageLoaded, setPageLoaded] = useState(false)

    useEffect(() => {
        localStorage.setItem('admin_sidebar_collapsed', String(collapsed))
    }, [collapsed])

    useEffect(() => {
        setPageLoaded(true)
        return () => setPageLoaded(false)
    }, [])

    return (
        <div className="flex min-h-screen bg-background dark:bg-gray-900">
            <Head title={`${title} - Administration`} />
            <Background />

            {/* Left Sidebar - Modern minimal version */}
            <div
                className={`fixed top-0 left-0 z-30 h-screen border-r border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900/90 ${
                    collapsed ? 'w-16' : 'w-56'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Sidebar Header */}
                    <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 dark:border-gray-800">
                        {!collapsed && (
                            <Link href={route('admin.index')} className="text-lg font-medium tracking-tight text-gray-800 dark:text-gray-200">
                                Administration
                            </Link>
                        )}
                        {collapsed && (
                            <Link href={route('admin.index')} className="flex w-full items-center justify-center text-gray-800 dark:text-gray-200">
                                <span className="sr-only">Administration</span>
                                <Settings className="h-5 w-5" />
                            </Link>
                        )}
                    </div>

                    {/* Admin Nav Links */}
                    <nav className="flex-1 overflow-y-auto p-3">
                        <ul className="space-y-1">
                            <li>
                                <Link
                                    href={route('admin.index')}
                                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                        window.location.pathname === '/administration'
                                            ? 'bg-gray-50/80 text-gray-900 dark:bg-gray-800/40 dark:text-gray-100'
                                            : ''
                                    }`}
                                >
                                    <LayoutDashboard className="h-4 w-4 flex-shrink-0 opacity-80" />
                                    {!collapsed && <span className="ml-3">Dashboard</span>}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('admin.users.index')}
                                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                        window.location.pathname.startsWith('/administration/users')
                                            ? 'bg-gray-50/80 text-gray-900 dark:bg-gray-800/40 dark:text-gray-100'
                                            : ''
                                    }`}
                                >
                                    <Users className="h-4 w-4 flex-shrink-0 opacity-80" />
                                    {!collapsed && <span className="ml-3">Users</span>}
                                </Link>
                            </li>
                            {/* Add more admin menu items here */}
                        </ul>
                    </nav>

                    {/* Back to main app */}
                    <div className="border-t border-gray-100 p-3 dark:border-gray-800">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4 flex-shrink-0 opacity-80" />
                            {!collapsed && <span className="ml-3">Back to App</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div
                className={`flex-1 transition-all duration-300 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ marginLeft: collapsed ? '4rem' : '14rem' }}
            >
                <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
                            <div className="relative flex items-center">
                                <button
                                    onClick={() => setCollapsed(!collapsed)}
                                    className="rounded-lg p-1.5 text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-300"
                                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                >
                                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                </button>
                            </div>

                            <div className="ml-3 flex items-center overflow-x-auto">
                                <ChevronRight className="mx-1 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Administration</span>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="relative z-10 flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 pt-6 pb-16">{children}</div>
                </main>
            </div>

            {/* Enhanced Toaster for notifications */}
            <Toaster
                position="top-right"
                closeButton={true}
                toastOptions={{
                    className: 'border border-gray-100 shadow-sm dark:border-gray-800',
                    style: {
                        background: 'var(--background)',
                        color: 'var(--foreground)',
                    },
                }}
            />
        </div>
    )
}
