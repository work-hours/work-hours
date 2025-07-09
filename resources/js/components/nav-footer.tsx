import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 px-3 py-2 ${className || ''}`}>
            <SidebarSeparator className="mb-3" />
            <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium uppercase text-[11px] tracking-wider mb-1">
                Resources
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: item.title }}
                                className="transition-all duration-200 text-sidebar-foreground/90 hover:text-sidebar-foreground"
                                size="sm"
                            >
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    {item.icon && (
                                        <Icon
                                            iconNode={item.icon}
                                            className="mr-2 text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground transition-colors duration-200 size-3.5"
                                        />
                                    )}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
