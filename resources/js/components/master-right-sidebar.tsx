import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type NavItem } from '@/types'
import { BarChart3, CheckSquare, ClockIcon, Folder, PlusCircle, UsersIcon } from 'lucide-react'
import Background from '@/components/ui/background'
import { Link } from '@inertiajs/react'

interface MasterRightSidebarProps {
    collapsed?: boolean
}

// Quick links from master-sidebar.tsx and QuickActions
const quickLinks: NavItem[] = [
    // QuickActions links
    {
        title: 'Log Time',
        href: route('time-log.create'),
        icon: ClockIcon,
    },
    {
        title: 'Add Team Member',
        href: route('team.create'),
        icon: UsersIcon,
    },
    {
        title: 'Create Project',
        href: route('project.create'),
        icon: PlusCircle,
    },
    {
        title: 'All Team Log',
        href: route('team.all-time-logs'),
        icon: BarChart3,
    },
    {
        title: 'Approvals',
        href: '/approvals',
        icon: CheckSquare,
    },
    {
        title: 'Feedback & Issues',
        href: 'https://github.com/msamgan/work-hours/issues',
        icon: Folder,
    },
]

export function MasterRightSidebar({ collapsed = true }: MasterRightSidebarProps) {
    return (
        <div
            className={`sticky top-0 flex h-screen flex-col border-l border-gray-300 bg-[#f8f6e9] shadow-sm transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900 ${collapsed ? 'w-20' : 'w-58'}`}
        >
            <Background  showPunches={false} showMarginLine={false} />

            {/* Quick Actions section */}
            <div className={`flex flex-col overflow-y-auto mt-2 ${collapsed ? '' : 'mr-8'}`}>
                <div className="mb-6 px-4">
                    <div className="mb-3 border-b border-gray-400 pb-2 dark:border-gray-600">
                        <h3
                            className={`text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-gray-200 ${collapsed ? 'text-center' : ''}`}
                        >
                            {collapsed ? 'Quick' : 'Quick Actions'}
                        </h3>
                    </div>
                    <TooltipProvider>
                        <nav className="relative z-10 space-y-1">
                            {quickLinks.slice(0, 5).map((item) => (
                                <div key={item.href} className="relative">
                                    <Link
                                        href={item.href}
                                        className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                                    >
                                        {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                        {!collapsed && <span>{item.title}</span>}
                                    </Link>
                                    {collapsed && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="left">{item.title}</TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </TooltipProvider>
                </div>
            </div>

            {/* Spacer to push links to bottom */}
            <div className="flex-1"></div>
        </div>
    )
}
