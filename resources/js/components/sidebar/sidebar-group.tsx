import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type NavItem } from '@/types'
import { Link } from '@inertiajs/react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NavItemGroup {
    title: string
    icon?: React.ElementType
    items: NavItem[]
}

interface SidebarGroupProps extends NavItemGroup {
    collapsed: boolean
    approvalCount: number
    pendingTaskCount: number
}

export function SidebarGroup({ title, icon: Icon, items, collapsed, approvalCount, pendingTaskCount }: SidebarGroupProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const anyItemActive = items.some(
        (item) => typeof window !== 'undefined' && (window.location.pathname === item.href || window.location.pathname.startsWith(`${item.href}/`)),
    )

    const hasApprovals = items.some((item) => item.href === '/time-log/approvals')
    const hasTasks = items.some((item) => item.href === '/task')
    const groupApprovalCount = hasApprovals ? approvalCount : 0
    const groupTaskCount = hasTasks ? pendingTaskCount : 0
    const totalBadgeCount = groupApprovalCount + groupTaskCount

    useEffect(() => {
        if (anyItemActive) {
            setIsExpanded(true)
        }
    }, [anyItemActive])

    useEffect(() => {
        if (collapsed) {
            setIsExpanded(true)
        }
    }, [collapsed])

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!collapsed) {
            const newState = !isExpanded
            setIsExpanded(newState)
        }
    }

    return (
        <div className="mb-2">
            <button
                type="button"
                onClick={toggleExpand}
                className={`group relative z-30 flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white hover:text-neutral-900 hover:shadow-sm dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 ${anyItemActive ? 'font-medium' : ''}`}
            >
                <div className="relative">
                    {Icon && (
                        <Icon
                            className={`h-5 w-5 flex-shrink-0 text-neutral-500 transition-transform duration-200 group-hover:scale-110 dark:text-neutral-400 ${!collapsed ? 'mr-3' : ''}`}
                            aria-hidden="true"
                        />
                    )}

                    {totalBadgeCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-0 -right-36 flex h-4 min-w-4 items-center justify-center overflow-hidden rounded-full border-0 bg-red-600 px-1 text-xs font-medium text-white shadow-sm dark:bg-red-500"
                        >
                            {totalBadgeCount > 99 ? '99+' : totalBadgeCount}
                        </Badge>
                    )}
                </div>

                {!collapsed && (
                    <>
                        <span className="flex-1 text-left">{title}</span>
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-neutral-500 transition-transform duration-200 dark:text-neutral-400" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-neutral-500 transition-transform duration-200 dark:text-neutral-400" />
                        )}
                    </>
                )}
            </button>

            {(collapsed || isExpanded) && (
                <div className={`mt-1 space-y-1 ${collapsed ? '' : 'ml-4'} overflow-hidden transition-all duration-300`}>
                    <TooltipProvider>
                        {items.map((item) => {
                            const isActive =
                                typeof window !== 'undefined' &&
                                (window.location.pathname === item.href || window.location.pathname.startsWith(`${item.href}/`))

                            return (
                                <div key={item.href} className="relative">
                                    <Link
                                        href={item.href}
                                        className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-neutral-50 text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                                                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow-sm dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                                        }`}
                                    >
                                        <div className="relative">
                                            {item.icon && (
                                                <item.icon
                                                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                                        !collapsed ? 'mr-3' : ''
                                                    } ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            {item.href === '/time-log/approvals' && approvalCount > 0 && (
                                                <Badge
                                                    variant="destructive"
                                                    className="absolute top-0 -right-24 flex h-4 min-w-4 items-center justify-center overflow-hidden rounded-full border-0 bg-red-600 px-1 text-xs font-medium text-white shadow-sm dark:bg-red-500"
                                                >
                                                    {approvalCount > 99 ? '99+' : approvalCount}
                                                </Badge>
                                            )}
                                            {item.href === '/task' && pendingTaskCount > 0 && (
                                                <Badge
                                                    variant="destructive"
                                                    className="absolute top-0 -right-16 flex h-4 min-w-4 items-center justify-center overflow-hidden rounded-full border-0 bg-red-600 px-1 text-xs font-medium text-white shadow-sm dark:bg-red-500"
                                                >
                                                    {pendingTaskCount > 99 ? '99+' : pendingTaskCount}
                                                </Badge>
                                            )}
                                        </div>
                                        {!collapsed && <span>{item.title}</span>}
                                        {isActive && (
                                            <div className="absolute inset-y-0 left-0 w-1 rounded-r-md bg-neutral-600 dark:bg-neutral-400"></div>
                                        )}
                                    </Link>
                                    {collapsed && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                className="border-neutral-200 bg-white text-neutral-800 shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                            >
                                                {item.title}
                                                {item.href === '/time-log/approvals' && approvalCount > 0 && ` (${approvalCount})`}
                                                {item.href === '/task' && pendingTaskCount > 0 && ` (${pendingTaskCount})`}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            )
                        })}
                    </TooltipProvider>
                </div>
            )}
        </div>
    )
}
