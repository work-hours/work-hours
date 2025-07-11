import { Icon } from '@/components/icon'
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { type ComponentPropsWithoutRef } from 'react'

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[]
}) {
    return (
        <SidebarGroup {...props} className={`px-3 py-3 group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarSeparator className="mb-4 bg-sidebar-border/40" />
            <SidebarGroupLabel className="mb-2 text-[11px] font-semibold tracking-wider text-sidebar-foreground/80 uppercase">
                Resources
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="space-y-1.5">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: item.title }}
                                className="text-sidebar-foreground/90 transition-all duration-300 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                                size="sm"
                            >
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    {item.icon && (
                                        <Icon
                                            iconNode={item.icon}
                                            className="mr-3 size-4 text-sidebar-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-sidebar-accent-foreground"
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
    )
}
