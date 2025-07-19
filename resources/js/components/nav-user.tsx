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
            <SidebarSeparator className="mb-3 bg-gray-400" />
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group border-2 border-gray-700 bg-white text-gray-900 transition-colors hover:bg-white/90 data-[state=open]:bg-white"
                        >
                            <UserInfo user={auth.user} />
                            <Icon
                                iconNode={ChevronsUpDown}
                                className="ml-auto size-4 text-gray-700 group-hover:text-gray-900"
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 border-2 border-gray-700 bg-white"
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
