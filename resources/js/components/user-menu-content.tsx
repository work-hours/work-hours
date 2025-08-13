import { Icon } from '@/components/icon'
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { UserInfo } from '@/components/user-info'
import { useMobileNavigation } from '@/hooks/use-mobile-navigation'
import { type User } from '@/types'
import { Link, router } from '@inertiajs/react'
import { LogOut, Palette, Settings } from 'lucide-react'

interface UserMenuContentProps {
    user: User
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation()

    const handleLogout = () => {
        cleanup()
        router.flushAll()
    }

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm text-neutral-800 dark:text-neutral-200">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                        href={route('profile.edit')}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Icon iconNode={Settings} className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                        href="/settings/appearance"
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Icon iconNode={Palette} className="mr-2" />
                        Appearance
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/10 dark:hover:text-red-300"
                    method="post"
                    href={route('logout')}
                    as="button"
                    onClick={handleLogout}
                >
                    <Icon iconNode={LogOut} className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    )
}
