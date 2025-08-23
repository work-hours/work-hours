import { MasterRightSidebarProps } from '@/@types/components'
import QuickTrackModal from '@/components/quick-track-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTimeTracker } from '@/contexts/time-tracker-context'
import { type NavItem, type User } from '@/types'
import { Link } from '@inertiajs/react'
import { useEchoPresence } from '@laravel/echo-react'
import { BarChart3, BrainCircuit, ClockIcon, PlusCircle, UsersIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const quickLinks: NavItem[] = [
    {
        title: 'Log Time',
        href: route('time-log.create'),
        icon: ClockIcon,
    },
    {
        title: 'Add Member',
        href: route('team.create'),
        icon: UsersIcon,
    },
    {
        title: 'New Project',
        href: route('project.create'),
        icon: PlusCircle,
    },
    {
        title: 'All Logs',
        href: route('team.all-time-logs'),
        icon: BarChart3,
    },
]

export function MasterRightSidebar({ collapsed = true }: MasterRightSidebarProps) {
    const handleAskAiClick = () => {
        window.dispatchEvent(new Event('open-ai-chat'))
    }

    const [quickOpen, setQuickOpen] = useState(false)
    const { running } = useTimeTracker()

    // Online users via presence channel
    type PresenceUser = Pick<User, 'id' | 'name' | 'email' | 'avatar'>
    const [online, setOnline] = useState<PresenceUser[]>([])

    const { channel, leave } = useEchoPresence<PresenceUser>('online')

    useEffect(() => {
        const ch = channel()
        // Initialize current online users
        ch.here((users: PresenceUser[]) => {
            setOnline(users)
        })
        // Someone joined
        ch.joining((user: PresenceUser) => {
            setOnline((prev) => {
                if (prev.some((u) => u.id === user.id)) return prev
                return [...prev, user]
            })
        })
        // Someone left
        ch.leaving((user: PresenceUser) => {
            setOnline((prev) => prev.filter((u) => u.id !== user.id))
        })

        return () => {
            // Leave presence channel on unmount
            leave()
        }
        // We want to (re)bind when the channel function identity changes
    }, [channel, leave])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const isT = (e.key || '').toLowerCase() === 't'
            const combo = (e.ctrlKey || e.metaKey) && e.shiftKey && isT
            if (!combo) return

            e.preventDefault()
            if (!running) {
                setQuickOpen(true)
            } else {
                toast.info('Tracker in session')
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [running])

    return (
        <div
            className={`sticky top-0 flex h-screen flex-col border-l border-neutral-200 bg-white shadow-sm transition-all duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 ${collapsed ? 'w-20' : 'w-52'}`}
        >
            <div className={`mt-2 flex flex-col overflow-y-auto ${collapsed ? '' : 'mr-8'}`}>
                <div className="mb-6 px-4">
                    <div className="mb-3 pb-2">
                        <h3
                            className={`text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400 ${collapsed ? 'text-center' : ''}`}
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
                                        className="flex items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-neutral-100"
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

                <div className="mb-6 px-4">
                    <div className="mb-3 pb-2">
                        <h3
                            className={`text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400 ${collapsed ? 'text-center' : ''}`}
                        >
                            {collapsed ? 'Tools' : 'Tools'}
                        </h3>
                    </div>
                    <TooltipProvider>
                        <nav className="relative z-10 space-y-1">
                            <div className="relative">
                                <button
                                    onClick={handleAskAiClick}
                                    className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-neutral-100"
                                >
                                    <BrainCircuit className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                    {!collapsed && <span>Ask AI</span>}
                                </button>
                                {collapsed && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Ask AI</TooltipContent>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => {
                                        if (running) {
                                            toast.info('Tracker in session')
                                            return
                                        }
                                        setQuickOpen(true)
                                    }}
                                    disabled={running}
                                    className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-neutral-100"
                                >
                                    <ClockIcon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                    {!collapsed && <span>Quick Track</span>}
                                </button>
                                {collapsed && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="pointer-events-none absolute inset-0 z-20 cursor-pointer"></div>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Quick Track</TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </nav>
                    </TooltipProvider>
                </div>

                {/* Online Now */}
                <div className="mb-6 px-4">
                    <div className="mb-3 pb-2">
                        <h3
                            className={`text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400 ${collapsed ? 'text-center' : ''}`}
                        >
                            {collapsed ? 'Online' : `Online (${online.length})`}
                        </h3>
                    </div>
                    <TooltipProvider>
                        {collapsed ? (
                            <div className="flex flex-col items-center gap-3">
                                {online.map((u) => (
                                    <Tooltip key={u.id}>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                <Avatar className="h-8 w-8 overflow-hidden border border-gray-400">
                                                    <AvatarImage src={u.avatar} alt={u.name} />
                                                    <AvatarFallback className="border border-gray-400 bg-gray-100 text-gray-800">
                                                        {u.name?.slice(0, 1) ?? '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">{u.name}</TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {online.map((u) => (
                                    <li key={u.id} className="flex items-center">
                                        <Avatar className="h-6 w-6 overflow-hidden border border-gray-400">
                                            <AvatarImage src={u.avatar} alt={u.name} />
                                            <AvatarFallback className="border border-gray-400 bg-gray-100 text-gray-800">
                                                {u.name?.slice(0, 1) ?? '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">{u.name}</span>
                                    </li>
                                ))}
                                {online.length === 0 && (
                                    <li className="text-sm text-neutral-500 dark:text-neutral-400">No one online</li>
                                )}
                            </ul>
                        )}
                    </TooltipProvider>
                </div>
            </div>
            <QuickTrackModal open={quickOpen} onOpenChange={setQuickOpen} />
        </div>
    )
}
