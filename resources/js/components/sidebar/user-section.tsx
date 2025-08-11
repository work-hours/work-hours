import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from '@inertiajs/react'
import { LogOut } from 'lucide-react'

interface UserSectionProps {
    collapsed: boolean
    user: {
        name?: string
    }
}

export function UserSection({ collapsed, user }: UserSectionProps) {
    return (
        <>
            <div className="mb-3 px-2">
                <div className={`flex items-center ${collapsed ? 'justify-center' : ''} relative z-10`}>
                    <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-700 shadow-sm ring-2 ring-white dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-800">
                            {user && user.name ? user.name.charAt(0) : ''}
                        </div>
                    </div>
                    {!collapsed && (
                        <div className="ml-3">
                            <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{user && user.name ? user.name : ''}</p>
                            <Link
                                href="/settings/profile"
                                className="relative z-10 text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                View profile
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom link with enhanced styling */}
            <div className="mt-auto border-t border-gray-200 px-2 pt-3 dark:border-gray-700">
                <TooltipProvider>
                    <div className="relative">
                        <Link
                            href={route('logout')}
                            method="post"
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-white hover:text-red-700 hover:shadow-sm dark:text-red-400 dark:hover:bg-gray-800 dark:hover:text-red-300"
                        >
                            <LogOut
                                className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                    !collapsed ? 'mr-3' : ''
                                } text-red-500 dark:text-red-400`}
                                aria-hidden="true"
                            />
                            {!collapsed && <span>Logout</span>}
                        </Link>
                        {collapsed && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="shadow-lg">
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </TooltipProvider>
            </div>
        </>
    )
}
