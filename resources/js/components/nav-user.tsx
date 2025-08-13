import { Icon } from '@/components/icon'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, useSidebar } from '@/components/ui/sidebar'
import { UserInfo } from '@/components/user-info'
import { UserMenuContent } from '@/components/user-menu-content'
import { useIsMobile } from '@/hooks/use-mobile'
import { type SharedData } from '@/types'
import { usePage } from '@inertiajs/react'
import { ChevronsUpDown } from 'lucide-react'

export function NavUser() {
    const { auth } = usePage<SharedData>().props
    const { state } = useSidebar()
    const isMobile = useIsMobile()

    return (
        <SidebarMenu className="mt-3 px-2">
            <SidebarSeparator className="mb-3 bg-neutral-300 dark:bg-neutral-600" />
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group border-2 border-neutral-300 bg-white text-neutral-800 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 data-[state=open]:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/70 dark:data-[state=open]:bg-neutral-800/70"
                        >
                            <UserInfo user={auth.user} />
                            <Icon
                                iconNode={ChevronsUpDown}
                                className="ml-auto size-4 text-neutral-600 transition-colors duration-200 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
