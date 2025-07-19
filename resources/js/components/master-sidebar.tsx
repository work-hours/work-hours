import { Link } from '@inertiajs/react'
import { Building, Folder, Github, Heart, LayoutGrid, LogOut, LucideProjector, LucideServerCog, Settings, TimerIcon } from 'lucide-react'
import { type NavItem, type SharedData } from '@/types'
import { usePage } from '@inertiajs/react'
import AppLogo from './app-logo'
import AppLogoIcon from './app-logo-icon'
import { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: '/project',
        icon: LucideProjector,
    },
    {
        title: 'Clients',
        href: '/client',
        icon: Building,
    },
    {
        title: 'Team',
        href: '/team',
        icon: LucideServerCog,
    },
    {
        title: 'Time Log',
        href: '/time-log',
        icon: TimerIcon,
    },
    {
        title: 'Integration',
        href: '/integration',
        icon: Settings,
    },
]

const integrationNavItems: NavItem[] = [
    {
        title: 'GitHub',
        href: '/github/repositories',
        icon: Github,
    },
]

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/msamgan/work-hours',
        icon: Folder,
    },
    {
        title: 'Sponsor',
        href: 'https://github.com/sponsors/msamgan',
        icon: Heart,
    },
]

export function MasterSidebar() {
    const { isGitHubIntegrated, auth } = usePage<SharedData>().props
    const [collapsed, setCollapsed] = useState(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('sidebar_collapsed')
            return savedState === 'true'
        }
        return false
    })

    // Save collapsed state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', String(collapsed))
    }, [collapsed])

    return (
        <div className={`sticky top-0 flex flex-col bg-[#f8f6e9] border-r border-gray-300 transition-all duration-300 ease-in-out h-screen ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* Horizontal lines like a timesheet */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem] pointer-events-none" aria-hidden="true"></div>

            {/* Vertical lines like a timesheet */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%] pointer-events-none" aria-hidden="true"></div>

            {/* Punch card holes */}
            <div className="absolute left-4 top-0 bottom-0 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y pointer-events-none" aria-hidden="true"></div>

            {/* Header */}
            <div className={`p-4 pt-6 pb-6 relative z-20 transition-all duration-300 ease-in-out ${collapsed ? 'flex flex-col items-center' : ''}`}>
                <div className={`flex items-center justify-between w-full ${collapsed ? 'flex-col' : ''}`}>
                    <Link
                        href="/dashboard"
                        className={`rounded-none transition-all duration-300 ease-in-out hover:bg-white border-2 border-gray-700 ${
                            collapsed ? 'p-1 mb-2 flex justify-center items-center' : 'p-2 flex items-center'
                        }`}
                    >
                        {collapsed ? (
                            <AppLogoIcon className="h-8 w-8" />
                        ) : (
                            <AppLogo />
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                            collapsed ? 'absolute -right-10 top-6 bg-[#f8f6e9] border border-gray-300 shadow-md z-30' : ''
                        }`}
                    >
                        {collapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="13 17 18 12 13 7"></polyline>
                                <polyline points="6 17 11 12 6 7"></polyline>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="11 17 6 12 11 7"></polyline>
                                <polyline points="18 17 13 12 18 7"></polyline>
                            </svg>
                        )}
                    </button>
                </div>
                <div className={`h-1 bg-gray-400 transition-all duration-300 ease-in-out ${collapsed ? 'w-full mt-4' : 'w-full mt-5'}`}></div>
            </div>

            {/* Navigation - scrollable content */}
            <div className="flex-1 overflow-y-auto pt-3 flex flex-col">
                {/* Platform Navigation */}
                <div className="mb-6 px-4">
                    <div className="border-b border-gray-400 pb-2 mb-3">
                        <h3 className={`text-sm font-bold text-gray-900 font-['Courier_New',monospace] uppercase tracking-wider ${collapsed ? 'text-center' : ''}`}>
                            {collapsed ? 'Menu' : 'Platform'}
                        </h3>
                    </div>
                    <TooltipProvider>
                        <nav className="space-y-1 relative z-10">
                            {mainNavItems.map((item) => (
                                <div key={item.href} className="relative">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-white hover:text-gray-900 ${
                                            typeof window !== 'undefined' && window.location.pathname === item.href
                                                ? 'bg-white text-gray-900 border-l-4 border-gray-700'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                        {!collapsed && <span>{item.title}</span>}
                                    </Link>
                                    {collapsed && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="absolute inset-0 z-20 cursor-pointer"></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </TooltipProvider>
                </div>

                {/* Integration Navigation */}
                {isGitHubIntegrated && (
                    <div className="mb-6 px-4">
                        <div className="border-b border-gray-400 pb-2 mb-3">
                            <h3 className={`text-sm font-bold text-gray-900 font-['Courier_New',monospace] uppercase tracking-wider ${collapsed ? 'text-center' : ''}`}>
                                {collapsed ? 'Int.' : 'Integration'}
                            </h3>
                        </div>
                        <TooltipProvider>
                            <nav className="space-y-1 relative z-10">
                                {integrationNavItems.map((item) => (
                                    <div key={item.href} className="relative">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-white hover:text-gray-900 ${
                                                typeof window !== 'undefined' && window.location.pathname === item.href
                                                    ? 'bg-white text-gray-900 border-l-4 border-gray-700'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                            {!collapsed && <span>{item.title}</span>}
                                        </Link>
                                        {collapsed && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="absolute inset-0 z-20 cursor-pointer"></div>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    {item.title}
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </TooltipProvider>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-400 pt-4 pb-4">
                <div className="px-4 mb-4">
                    <h3 className={`text-xs font-bold text-gray-900 font-['Courier_New',monospace] uppercase tracking-wider mb-2 ${collapsed ? 'text-center' : ''}`}>
                        {collapsed ? 'Links' : 'Links'}
                    </h3>
                    <TooltipProvider>
                        <nav className="space-y-1 relative z-10">
                            {footerNavItems.map((item) => (
                                <div key={item.href} className="relative">
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-white hover:text-gray-900"
                                    >
                                        {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                        {!collapsed && <span>{item.title}</span>}
                                    </a>
                                    {collapsed && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="absolute inset-0 z-20 cursor-pointer"></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </TooltipProvider>
                </div>

                {/* User section */}
                <div className="px-4 mb-3">
                    <div className={`flex items-center ${collapsed ? 'justify-center' : ''} relative z-10`}>
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                                {auth.user && auth.user.name ? auth.user.name.charAt(0) : ''}
                            </div>
                        </div>
                        {!collapsed && (
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 truncate">{auth.user && auth.user.name ? auth.user.name : ''}</p>
                                <Link href="/settings/profile" className="text-xs text-gray-500 hover:text-gray-700 relative z-10">
                                    View profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom link - always at the bottom of sidebar */}
                <div className="mt-auto pt-4 px-4 border-t border-gray-400">
                    <TooltipProvider>
                        <div className="relative">
                            <Link
                                href={route('logout')}
                                method="post"
                                className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-white hover:text-gray-900"
                            >
                                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                {!collapsed && <span>Logout</span>}
                            </Link>
                            {collapsed && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="absolute inset-0 z-20 cursor-pointer"></div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        Logout
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}
