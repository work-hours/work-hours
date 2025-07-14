import { Icon } from '@/components/icon'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export function NavMain({ items = [], title = 'Platform' }: { items: NavItem[]; title?: string }) {
    const page = usePage()
    return (
        <SidebarGroup className="px-4 py-4">
            <SidebarGroupLabel className="mb-3 text-[11px] font-semibold tracking-wider text-sidebar-foreground/90 uppercase">
                {title}
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-2.5">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                            className={`rounded-lg font-medium transition-all duration-300 ${
                                page.url.startsWith(item.href)
                                    ? 'bg-sidebar-accent/80 shadow-md'
                                    : 'hover:translate-x-1.5 hover:bg-sidebar-accent/20 hover:shadow-sm'
                            }`}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <Icon
                                        iconNode={item.icon}
                                        className={`mr-3.5 transition-all duration-300 ${
                                            page.url.startsWith(item.href)
                                                ? 'scale-115 text-sidebar-accent-foreground'
                                                : 'text-sidebar-foreground/80 group-hover:scale-115 group-hover:text-sidebar-accent-foreground'
                                        }`}
                                    />
                                )}
                                <span className="font-medium">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
