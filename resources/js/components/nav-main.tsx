import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium uppercase text-[11px] tracking-wider mb-1">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1.5">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                            className="transition-all duration-200 font-medium"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <Icon
                                        iconNode={item.icon}
                                        className="mr-2 text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground transition-colors duration-200"
                                    />
                                )}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
