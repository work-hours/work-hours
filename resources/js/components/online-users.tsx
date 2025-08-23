import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { type SharedData, type User } from '@/types'
import { usePage } from '@inertiajs/react'
import { useEchoPresence } from '@laravel/echo-react'
import { useEffect, useMemo, useState } from 'react'

export interface OnlineUsersProps {
    collapsed?: boolean
}
export type PresenceUser = Pick<User, 'id' | 'name' | 'email' | 'avatar'>

export default function OnlineUsers({ collapsed = true }: OnlineUsersProps) {
    const { auth, teamContext } = usePage<SharedData>().props as SharedData & {
        teamContext?: { leaderIds: number[]; memberIds: number[] } | null
    }

    const [online, setOnline] = useState<PresenceUser[]>([])
    const { channel, leave } = useEchoPresence<PresenceUser>('online')
    useEffect(() => {
        const ch = channel()
        ch.here((users: PresenceUser[]) => {
            setOnline(users.filter((u) => u.id !== auth.user.id))
        })
        ch.joining((user: PresenceUser) => {
            if (user.id === auth.user.id) return
            setOnline((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]))
        })
        ch.leaving((user: PresenceUser) => {
            if (user.id === auth.user.id) return
            setOnline((prev) => prev.filter((u) => u.id !== user.id))
        })

        return () => {
            leave()
        }
    }, [channel, leave, auth.user.id])
    const filteredOnline = useMemo(() => {
        const tc = teamContext ?? null
        if (!tc) return [] as PresenceUser[]
        const ids = new Set<number>()
        if (Array.isArray(tc.memberIds)) {
            for (const id of tc.memberIds) ids.add(id)
        }
        if (Array.isArray(tc.leaderIds)) {
            for (const id of tc.leaderIds) ids.add(id)
        }
        if (ids.size === 0) return [] as PresenceUser[]
        return online.filter((u) => ids.has(u.id))
    }, [online, teamContext])

    return (
        <div className="mb-6 px-4">
            <div className="mb-3 pb-2">
                <h3
                    className={`text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400 ${collapsed ? 'text-center' : ''}`}
                >
                    {collapsed ? 'Online' : `Online (${filteredOnline.length})`}
                </h3>
            </div>
            <TooltipProvider>
                {collapsed ? (
                    <div className="flex flex-col items-center gap-3">
                        {filteredOnline.map((u) => (
                            <Tooltip key={u.id}>
                                <TooltipTrigger asChild>
                                    <span
                                        className="block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-900"
                                        aria-label="Online"
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="left">{u.name}</TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {filteredOnline.map((u) => (
                            <li key={u.id} className="flex items-center">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" aria-hidden="true" />
                                <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">{u.name}</span>
                            </li>
                        ))}
                        {filteredOnline.length === 0 && <li className="text-sm text-neutral-500 dark:text-neutral-400">No one online</li>}
                    </ul>
                )}
            </TooltipProvider>
        </div>
    )
}
