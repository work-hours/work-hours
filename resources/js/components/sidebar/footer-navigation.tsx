import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type NavItem } from '@/types'
import { Folder } from 'lucide-react'

interface FooterNavigationProps {
    collapsed: boolean
}

const footerNavItems: NavItem[] = [
    {
        title: 'Feedback & Issues',
        href: 'https://github.com/msamgan/work-hours/issues',
        icon: Folder,
    },
]

export function FooterNavigation({ collapsed }: FooterNavigationProps) {
    return (
        <div className="mb-4">
            <h3 className={`mb-2 text-xs font-bold tracking-wider text-gray-700 uppercase dark:text-gray-300 ${collapsed ? 'text-center' : 'px-2'}`}>
                Links
            </h3>
            <TooltipProvider>
                <nav className="relative z-10 space-y-1">
                    {footerNavItems.map((item) => (
                        <div key={item.href} className="relative">
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                            >
                                {item.icon && (
                                    <item.icon
                                        className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                            !collapsed ? 'mr-3' : ''
                                        } text-gray-500 dark:text-gray-400`}
                                        aria-hidden="true"
                                    />
                                )}
                                {!collapsed && <span>{item.title}</span>}
                            </a>
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
                    ))}
                </nav>
            </TooltipProvider>
        </div>
    )
}
