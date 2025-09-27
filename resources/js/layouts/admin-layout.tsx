import Background from '@/components/ui/background'
import { Head, Link, usePage } from '@inertiajs/react'
import {
    Briefcase, CheckSquare, ChevronDown, ChevronLeft, ChevronRight,
    Coins, LayoutDashboard, Projector, Settings, Users, Clock,
    Search, Bell, Moon, Sun, UserCircle
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'

interface AdminLayoutProps {
    children: ReactNode
    title?: string
}

interface NavGroupProps {
    title: string
    children: ReactNode
    defaultOpen?: boolean
}

const NavGroup = ({ title, children, defaultOpen = false }: NavGroupProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200"
            >
                <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`mt-1 space-y-1 pl-2 ${isOpen ? 'block' : 'hidden'}`}>
                {children}
            </div>
        </div>
    )
}

export default function AdminLayout({ children, title = 'Admin' }: AdminLayoutProps) {
    const { auth } = usePage().props as any
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('admin_sidebar_collapsed')
            return savedState === 'true'
        }
        return false
    })

    const [pageLoaded, setPageLoaded] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark')
        }
        return false
    })

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        if (newDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    useEffect(() => {
        localStorage.setItem('admin_sidebar_collapsed', String(collapsed))
    }, [collapsed])

    useEffect(() => {
        setPageLoaded(true)
        return () => setPageLoaded(false)
    }, [])

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={`${title} - Administration`} />
            <Background />

            <div
                className={`fixed top-0 left-0 z-30 h-screen border-r border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900/95 ${
                    collapsed ? 'w-16' : 'w-64'
                }`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                        {!collapsed && (
                            <Link href={route('admin.index')} className="flex items-center space-x-2 text-lg font-medium tracking-tight text-gray-800 dark:text-gray-200">
                                <Settings className="h-5 w-5 text-indigo-500" />
                                <span>Administration</span>
                            </Link>
                        )}
                        {collapsed && (
                            <Link href={route('admin.index')} className="flex w-full items-center justify-center text-gray-800 dark:text-gray-200">
                                <span className="sr-only">Administration</span>
                                <Settings className="h-5 w-5 text-indigo-500" />
                            </Link>
                        )}
                    </div>

                    <nav className="flex-1 overflow-y-auto p-3">
                        {!collapsed ? (
                            <>
                                <div className="mb-4">
                                    <NavGroup title="Main" defaultOpen={true}>
                                        <Link
                                            href={route('admin.index')}
                                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                                window.location.pathname === '/administration'
                                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                    : ''
                                            }`}
                                        >
                                            <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3">Dashboard</span>
                                        </Link>
                                    </NavGroup>

                                    <NavGroup title="Management" defaultOpen={true}>
                                        <Link
                                            href={route('admin.users.index')}
                                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                                window.location.pathname.startsWith('/administration/users')
                                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                    : ''
                                            }`}
                                        >
                                            <Users className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3">Users</span>
                                        </Link>
                                        <Link
                                            href={route('admin.clients.index')}
                                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                                window.location.pathname.startsWith('/administration/clients')
                                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                    : ''
                                            }`}
                                        >
                                            <Briefcase className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3">Clients</span>
                                        </Link>
                                    </NavGroup>

                                    <NavGroup title="Projects & Tasks" defaultOpen={true}>
                                        <Link
                                            href={route('admin.projects.index')}
                                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                                window.location.pathname.startsWith('/administration/projects')
                                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                    : ''
                                            }`}
                                        >
                                            <Projector className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3">Projects</span>
                                        </Link>
                                        <Link
                                            href={route('admin.tasks.index')}
                                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                                window.location.pathname.startsWith('/administration/tasks')
                                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                    : ''
                                            }`}
                                        >
                                            <CheckSquare className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3">Tasks</span>
                                        </Link>
                                    </NavGroup>

                                    <NavGroup title="Tracking & Finances" defaultOpen={true}>
                                        <Link
                                            href={route('admin.time-logs.index')}
                                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                                window.location.pathname.startsWith('/administration/time-logs')
                                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                    : ''
                                            }`}
                                        >
                                            <Clock className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3">Time Logs</span>
                                        </Link>
                                        <Link
                                            href={route('admin.invoices.index')}
                                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                                window.location.pathname.startsWith('/administration/invoices')
                                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                    : ''
                                            }`}
                                        >
                                            <Coins className="h-4 w-4 flex-shrink-0" />
                                            <span className="ml-3">Invoices</span>
                                        </Link>
                                    </NavGroup>
                                </div>
                            </>
                        ) : (
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href={route('admin.index')}
                                        className={`flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                            window.location.pathname === '/administration'
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                : ''
                                        }`}
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span className="sr-only">Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('admin.users.index')}
                                        className={`flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                            window.location.pathname.startsWith('/administration/users')
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                : ''
                                        }`}
                                    >
                                        <Users className="h-5 w-5" />
                                        <span className="sr-only">Users</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('admin.clients.index')}
                                        className={`flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                            window.location.pathname.startsWith('/administration/clients')
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                : ''
                                        }`}
                                    >
                                        <Briefcase className="h-5 w-5" />
                                        <span className="sr-only">Clients</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('admin.projects.index')}
                                        className={`flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                            window.location.pathname.startsWith('/administration/projects')
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                : ''
                                        }`}
                                    >
                                        <Projector className="h-5 w-5" />
                                        <span className="sr-only">Projects</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('admin.tasks.index')}
                                        className={`flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                            window.location.pathname.startsWith('/administration/tasks')
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                : ''
                                        }`}
                                    >
                                        <CheckSquare className="h-5 w-5" />
                                        <span className="sr-only">Tasks</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('admin.time-logs.index')}
                                        className={`flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                            window.location.pathname.startsWith('/administration/time-logs')
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                : ''
                                        }`}
                                    >
                                        <Clock className="h-5 w-5" />
                                        <span className="sr-only">Time Logs</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('admin.invoices.index')}
                                        className={`flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100 ${
                                            window.location.pathname.startsWith('/administration/invoices')
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300'
                                                : ''
                                        }`}
                                    >
                                        <Coins className="h-5 w-5" />
                                        <span className="sr-only">Invoices</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </nav>

                    <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                            {!collapsed && <span className="ml-3">Back to App</span>}
                        </Link>
                    </div>
                </div>
            </div>

            <div
                className={`flex-1 transition-all duration-300 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ marginLeft: collapsed ? '4rem' : '16rem' }}
            >
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
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

                            <div className="ml-3 hidden items-center overflow-x-auto md:flex">
                                <ChevronRight className="mx-1 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Administration</span>
                                {title !== 'Admin' && (
                                    <>
                                        <ChevronRight className="mx-1 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={toggleDarkMode}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            <div className="relative">
                                <button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="sr-only">Open user menu</span>
                                    {auth?.user?.profile_photo_url ? (
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={auth.user.profile_photo_url}
                                            alt={auth.user.name}
                                        />
                                    ) : (
                                        <UserCircle className="h-8 w-8 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="relative z-10 flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 pt-6 pb-16 transition-all duration-200">
                        {children}
                    </div>
                </main>
            </div>

            <Toaster
                position="top-right"
                closeButton={true}
                toastOptions={{
                    className: 'border border-gray-200 shadow-sm dark:border-gray-800',
                    style: {
                        background: 'var(--background)',
                        color: 'var(--foreground)',
                    },
                }}
            />
        </div>
    )
}
