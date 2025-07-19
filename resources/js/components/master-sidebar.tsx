import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type NavItem, type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { Building, Folder, Github, Heart, LayoutGrid, LogOut, LucideProjector, LucideServerCog, Settings, TimerIcon } from 'lucide-react'
import AppLogo from './app-logo'
import AppLogoIcon from './app-logo-icon'

interface MasterSidebarProps {
    collapsed: boolean
}

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

export function MasterSidebar({ collapsed }: MasterSidebarProps) {
    const { isGitHubIntegrated, auth } = usePage<SharedData>().props

    return (
        <div
            className={`sticky top-0 flex h-screen flex-col border-r border-gray-300 bg-[#f8f6e9] shadow-sm transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Enhanced horizontal lines with slightly increased contrast */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:100%_2rem]"
                aria-hidden="true"
            ></div>

            {/* Enhanced vertical lines with slightly increased contrast */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:2rem_100%]"
                aria-hidden="true"
            ></div>

            {/* Header with improved styling */}
            <div className={`relative z-20 p-4 pt-6 pb-6 transition-all duration-300 ease-in-out ${collapsed ? 'flex flex-col items-center' : ''}`}>
                <div className={`flex w-full items-center ${collapsed ? 'flex-col' : ''}`}>
                    <Link
                        href="/dashboard"
                        className={`rounded-none border-2 border-gray-700 bg-white/50 transition-all duration-300 ease-in-out hover:bg-white hover:shadow-sm ${
                            collapsed ? 'mb-2 flex items-center justify-center p-1' : 'flex items-center p-2'
                        }`}
                    >
                        {collapsed ? <AppLogoIcon className="h-8 w-8" /> : <AppLogo />}
                    </Link>
                </div>
            </div>

            {/* Navigation - scrollable content */}
            <div className="flex flex-1 flex-col overflow-y-auto pt-3">
                {/* Platform Navigation */}
                <div className="mb-6 px-4">
                    <div className="mb-3 border-b border-gray-400 pb-2">
                        <h3
                            className={`font-['Courier_New',monospace] text-sm font-bold tracking-wider text-gray-900 uppercase ${collapsed ? 'text-center' : ''}`}
                        >
                            {collapsed ? 'Menu' : 'Platform'}
                        </h3>
                    </div>
                    <TooltipProvider>
                        <nav className="relative z-10 space-y-1">
                            {mainNavItems.map((item) => (
                                <div key={item.href} className="relative">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200 hover:bg-white hover:shadow-sm hover:text-gray-900 ${
                                            typeof window !== 'undefined' && window.location.pathname === item.href
                                                ? 'border-l-4 border-gray-700 bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                        {!collapsed && <span>{item.title}</span>}
                                    </Link>
                                    {collapsed && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">{item.title}</TooltipContent>
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
                        <div className="mb-3 border-b border-gray-400 pb-2">
                            <h3
                                className={`font-['Courier_New',monospace] text-sm font-bold tracking-wider text-gray-900 uppercase ${collapsed ? 'text-center' : ''}`}
                            >
                                {collapsed ? 'Int.' : 'Integration'}
                            </h3>
                        </div>
                        <TooltipProvider>
                            <nav className="relative z-10 space-y-1">
                                {integrationNavItems.map((item) => (
                                    <div key={item.href} className="relative">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200 hover:bg-white hover:shadow-sm hover:text-gray-900 ${
                                                typeof window !== 'undefined' && window.location.pathname === item.href
                                                    ? 'border-l-4 border-gray-700 bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                            {!collapsed && <span>{item.title}</span>}
                                        </Link>
                                        {collapsed && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">{item.title}</TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </TooltipProvider>
                    </div>
                )}
            </div>

            {/* Footer with enhanced styling */}
            <div className="border-t border-gray-400 pt-4 pb-4">
                <div className="mb-4 px-4">
                    <h3
                        className={`mb-2 font-['Courier_New',monospace] text-xs font-bold tracking-wider text-gray-900 uppercase ${collapsed ? 'text-center' : ''}`}
                    >
                        {collapsed ? 'Links' : 'Links'}
                    </h3>
                    <TooltipProvider>
                        <nav className="relative z-10 space-y-1">
                            {footerNavItems.map((item) => (
                                <div key={item.href} className="relative">
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:shadow-sm hover:text-gray-900"
                                    >
                                        {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                        {!collapsed && <span>{item.title}</span>}
                                    </a>
                                    {collapsed && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">{item.title}</TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </TooltipProvider>
                </div>

                {/* User section with enhanced styling */}
                <div className="mb-3 px-4">
                    <div className={`flex items-center ${collapsed ? 'justify-center' : ''} relative z-10`}>
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-bold text-gray-700 shadow-sm">
                                {auth.user && auth.user.name ? auth.user.name.charAt(0) : ''}
                            </div>
                        </div>
                        {!collapsed && (
                            <div className="ml-3">
                                <p className="truncate text-sm font-medium text-gray-700">{auth.user && auth.user.name ? auth.user.name : ''}</p>
                                <Link href="/settings/profile" className="relative z-10 text-xs text-gray-500 transition-colors hover:text-gray-700">
                                    View profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom link with enhanced styling */}
                <div className="mt-auto border-t border-gray-400 px-4 pt-4">
                    <TooltipProvider>
                        <div className="relative">
                            <Link
                                href={route('logout')}
                                method="post"
                                className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:shadow-sm hover:text-gray-900"
                            >
                                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                {!collapsed && <span>Logout</span>}
                            </Link>
                            {collapsed && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Logout</TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}
