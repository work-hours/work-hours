import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { type NavItem } from '@/types'
import { BrainCircuit, ClockIcon, Folder } from 'lucide-react'
import { useState } from 'react'
import Background from '@/components/ui/background'
import FloatingTimeTracker from '@/components/floating-time-tracker'
import FloatingAiChat from '@/components/floating-ai-chat'

interface MasterRightSidebarProps {
    projects: Array<{ id: number; name: string }>
    tasks: Array<{ id: number; title: string; project_id: number }>
    collapsed?: boolean
}

// Quick links from master-sidebar.tsx
const quickLinks: NavItem[] = [
    {
        title: 'Feedback & Issues',
        href: 'https://github.com/msamgan/work-hours/issues',
        icon: Folder,
    },
]

export function MasterRightSidebar({ projects, tasks, collapsed = true }: MasterRightSidebarProps) {
    const [timeTrackerOpen, setTimeTrackerOpen] = useState(false)
    const [aiChatOpen, setAiChatOpen] = useState(false)

    return (
        <div
            className={`sticky top-0 flex h-screen flex-col border-l border-gray-300 bg-[#f8f6e9] shadow-sm transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900 ${collapsed ? 'w-20' : 'w-68'}`}
        >
            <Background />

            {/* Header with improved styling */}
            <div className={`relative z-20 p-4 pt-6 pb-6 transition-all duration-300 ease-in-out ${collapsed ? 'flex flex-col items-center' : 'mr-8'}`}>
                <div className={`flex w-full items-center justify-end ${collapsed ? 'flex-col' : ''}`}>
                    {/* Empty header to match left sidebar structure */}
                </div>
            </div>

            {/* Navigation - scrollable content */}
            <div className={`flex flex-1 flex-col overflow-y-auto pt-3 ${collapsed ? '' : 'mr-8'}`}>
                {/* Tools Navigation */}
                <div className="mb-6 px-4">
                    <div className="mb-3 border-b border-gray-400 pb-2 dark:border-gray-600">
                        <h3
                            className={`text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-gray-200 ${collapsed ? 'text-center' : ''}`}
                        >
                            {collapsed ? 'Tools' : 'Tools'}
                        </h3>
                    </div>
                    <TooltipProvider>
                        <nav className="relative z-10 space-y-1">
                            {/* Time Tracker Button */}
                            <div className="relative">
                                <Sheet open={timeTrackerOpen} onOpenChange={setTimeTrackerOpen}>
                                    <SheetTrigger asChild>
                                        <button
                                            className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                                        >
                                            <ClockIcon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                            {!collapsed && <span>Time Tracker</span>}
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent className="overflow-hidden p-0">
                                        <FloatingTimeTracker projects={projects} tasks={tasks} />
                                    </SheetContent>
                                </Sheet>
                                {collapsed && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Time Tracker</TooltipContent>
                                    </Tooltip>
                                )}
                            </div>

                            {/* AI Chat Button */}
                            <div className="relative">
                                <Sheet open={aiChatOpen} onOpenChange={setAiChatOpen}>
                                    <SheetTrigger asChild>
                                        <button
                                            className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                                        >
                                            <BrainCircuit className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                            {!collapsed && <span>Ask AI</span>}
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent className="overflow-hidden p-0 sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
                                        <FloatingAiChat projects={projects} />
                                    </SheetContent>
                                </Sheet>
                                {collapsed && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Ask AI</TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </nav>
                    </TooltipProvider>
                </div>
            </div>

            {/* Footer with quick links */}
            <div className={`border-t border-gray-400 pt-4 pb-4 dark:border-gray-600 ${collapsed ? '' : 'mr-8'}`}>
                <div className="mb-4 px-4">
                    <h3
                        className={`mb-2 text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-gray-200 ${collapsed ? 'text-center' : ''}`}
                    >
                        {collapsed ? 'Links' : 'Links'}
                    </h3>
                    <TooltipProvider>
                        <nav className="relative z-10 space-y-1">
                            {quickLinks.map((item) => (
                                <div key={item.href} className="relative">
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                                    >
                                        {item.icon && <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                                        {!collapsed && <span>{item.title}</span>}
                                    </a>
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
        </div>
    )
}
