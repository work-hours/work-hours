import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type NavItem } from '@/types'
import { Link } from '@inertiajs/react'
import { Github } from 'lucide-react'
import JiraIcon from '../icons/jira-icon'

interface IntegrationNavigationProps {
    collapsed: boolean
    isGitHubIntegrated: boolean
    isJiraIntegrated: boolean
}

const integrationNavItems: NavItem[] = [
    {
        title: 'GitHub',
        href: '/github/repositories',
        icon: Github,
    },
    {
        title: 'Jira',
        href: '/jira/projects',
        icon: JiraIcon,
    },
]

export function IntegrationNavigation({ collapsed, isGitHubIntegrated, isJiraIntegrated }: IntegrationNavigationProps) {
    const showIntegrationNav = isGitHubIntegrated || isJiraIntegrated

    if (!showIntegrationNav) {
        return null
    }

    return (
        <div className="mb-6">
            <div className="mb-3 border-b border-gray-300 pb-2 dark:border-gray-600">
                <h3 className={`text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-gray-300 ${collapsed ? 'text-center' : 'px-2'}`}>
                    {collapsed ? 'Int.' : 'Integration'}
                </h3>
            </div>
            <TooltipProvider>
                <nav className="relative z-10 space-y-1">
                    {integrationNavItems
                        .filter((item) => (item.title === 'GitHub' && isGitHubIntegrated) || (item.title === 'Jira' && isJiraIntegrated))
                        .map((item) => {
                            const isActive =
                                typeof window !== 'undefined' &&
                                (window.location.pathname === item.href || window.location.pathname.startsWith(`${item.href}/`))
                            return (
                                <div key={item.href} className="relative">
                                    <Link
                                        href={item.href}
                                        className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100'
                                                : 'text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                        }`}
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                                    !collapsed ? 'mr-3' : ''
                                                } ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {!collapsed && <span>{item.title}</span>}
                                        {isActive && <div className="absolute inset-y-0 left-0 w-1 rounded-r-md bg-gray-700 dark:bg-gray-400"></div>}
                                    </Link>
                                    {collapsed && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="shadow-lg">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            )
                        })}
                </nav>
            </TooltipProvider>
        </div>
    )
}
