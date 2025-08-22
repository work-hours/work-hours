import { type NavItem, type SharedData } from '@/types'
import { count } from '@actions/ApprovalController'
import { count as taskCount } from '@actions/TaskController'
import { Link, usePage } from '@inertiajs/react'
import { Building, CheckSquare, ClipboardList, FileText, LayoutGrid, LucideProjector, LucideServerCog, Settings, TimerIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import AppLogo from './app-logo'
import AppLogoIcon from './app-logo-icon'
import { FooterNavigation } from './sidebar/footer-navigation'
import { IntegrationNavigation } from './sidebar/integration-navigation'
import { SidebarGroup } from './sidebar/sidebar-group'
import { UserSection } from './sidebar/user-section'

interface MasterSidebarProps {
    collapsed: boolean
}

interface NavItemGroup {
    title: string
    icon?: React.ElementType
    items: NavItem[]
}

const navGroups: NavItemGroup[] = [
    {
        title: 'Dashboard',
        icon: LayoutGrid,
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Team',
                href: '/team',
                icon: LucideServerCog,
            },
        ],
    },
    {
        title: 'Work',
        icon: Building,
        items: [
            {
                title: 'Clients',
                href: '/client',
                icon: Building,
            },
            {
                title: 'Projects',
                href: '/project',
                icon: LucideProjector,
            },
            {
                title: 'Tasks',
                href: '/task',
                icon: ClipboardList,
            },
        ],
    },
    {
        title: 'Time & Billing',
        icon: TimerIcon,
        items: [
            {
                title: 'Time Log',
                href: '/time-log',
                icon: TimerIcon,
            },
            {
                title: 'Tags',
                href: '/tags',
                icon: FileText,
            },
            {
                title: 'Invoices',
                href: '/invoice',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Administration',
        icon: Settings,
        items: [
            {
                title: 'Approvals',
                href: '/approvals',
                icon: CheckSquare,
            },
            {
                title: 'Integration',
                href: '/integration',
                icon: Settings,
            },
        ],
    },
]

export function MasterSidebar({ collapsed }: MasterSidebarProps) {
    const { isGitHubIntegrated, isJiraIntegrated, auth } = usePage<SharedData>().props
    const [approvalCount, setApprovalCount] = useState(0)
    const [pendingTaskCount, setPendingTaskCount] = useState(0)

    const fetchApprovalCount = async () => {
        try {
            const response = await count.data({})
            setApprovalCount(response.count)
        } catch (error) {
            console.error('Failed to fetch approval count', error)
        }
    }

    const fetchPendingTaskCount = async () => {
        try {
            const response = await taskCount.data({})
            setPendingTaskCount(response.count)
        } catch (error) {
            console.error('Failed to fetch pending task count', error)
        }
    }

    useEffect(() => {
        fetchApprovalCount().then()
        const intervalId = setInterval(fetchApprovalCount, 60000)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        fetchPendingTaskCount().then()
        const intervalId = setInterval(fetchPendingTaskCount, 60000)
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div
            className={`sticky top-0 flex h-screen flex-col border-r border-neutral-200 bg-white shadow-sm transition-all duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 ${
                collapsed ? 'w-20' : 'w-62'
            }`}
        >
            <div
                className={`border-b border-neutral-200 transition-all duration-300 ease-in-out dark:border-neutral-700 ${
                    collapsed ? 'flex flex-col items-center' : 'px-2'
                }`}
            >
                <div className={`flex w-full items-center ${collapsed ? 'flex-col justify-center' : ''}`}>
                    <Link href={route('dashboard')} className={`${collapsed ? 'mb-2 flex items-center justify-center p-1' : 'flex items-center'}`}>
                        {collapsed ? <AppLogoIcon className="h-12 w-24 text-neutral-700 dark:text-neutral-300" /> : <AppLogo />}
                    </Link>
                </div>
            </div>

            <div className={`flex flex-1 flex-col overflow-y-auto pt-3 ${collapsed ? 'px-2' : 'px-4'}`}>
                <div className="mb-6">
                    <div className="mb-3 pb-2">
                        <h3
                            className={`text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400 ${
                                collapsed ? 'text-center' : 'px-2'
                            }`}
                        >
                            {collapsed ? 'Menu' : 'Platform'}
                        </h3>
                    </div>
                    <div className="space-y-1">
                        {navGroups.map((group) => (
                            <SidebarGroup
                                key={group.title}
                                title={group.title}
                                icon={group.icon}
                                items={group.items}
                                collapsed={collapsed}
                                approvalCount={approvalCount}
                                pendingTaskCount={pendingTaskCount}
                            />
                        ))}
                    </div>
                </div>

                <IntegrationNavigation collapsed={collapsed} isGitHubIntegrated={isGitHubIntegrated} isJiraIntegrated={isJiraIntegrated} />
            </div>

            <div className={`border-t border-neutral-200 pt-3 pb-4 dark:border-neutral-700 ${collapsed ? 'px-2' : 'px-4'}`}>
                <FooterNavigation collapsed={collapsed} />
                <UserSection collapsed={collapsed} user={auth.user} />
            </div>
        </div>
    )
}
