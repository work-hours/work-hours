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
            <SidebarSeparator className="mb-3 bg-sidebar-border/40" />
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group rounded-lg border border-sidebar-border/40 text-sidebar-accent-foreground shadow-md transition-all duration-300 hover:border-sidebar-border/60 hover:bg-sidebar-accent/20 hover:shadow-lg data-[state=open]:bg-sidebar-accent"
                        >
                            <UserInfo user={auth.user} />
                            <Icon
                                iconNode={ChevronsUpDown}
                                className="ml-auto size-4 opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-sidebar-border/50 shadow-lg"
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
