import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { type User } from '@/types'

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials()

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden border border-gray-400">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="border border-gray-400 bg-gray-100 text-gray-800">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-['Courier_New',monospace] font-bold text-gray-800">{user.name}</span>
                {showEmail && <span className="truncate font-['Courier_New',monospace] text-xs text-gray-600">{user.email}</span>}
            </div>
        </>
    )
}
