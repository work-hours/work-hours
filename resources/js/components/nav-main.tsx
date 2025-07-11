import { Icon } from '@/components/icon'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage()
    return (
        <SidebarGroup className="px-3 py-3">
            <SidebarGroupLabel className="mb-2 text-[11px] font-semibold tracking-wider text-sidebar-foreground/80 uppercase">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-2">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                            className={`font-medium transition-all duration-300 ${
                                page.url.startsWith(item.href) ? 'bg-sidebar-accent/80 shadow-sm' : 'hover:translate-x-1'
                            }`}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <Icon
                                        iconNode={item.icon}
                                        className={`mr-3 transition-all duration-300 ${
                                            page.url.startsWith(item.href)
                                                ? 'scale-110 text-sidebar-accent-foreground'
                                                : 'text-sidebar-foreground/70 group-hover:scale-110 group-hover:text-sidebar-accent-foreground'
                                        }`}
                                    />
                                )}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
