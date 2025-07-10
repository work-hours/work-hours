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
        <SidebarGroup {...props} className={`px-3 py-2 group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarSeparator className="mb-3" />
            <SidebarGroupLabel className="mb-1 text-[11px] font-medium tracking-wider text-sidebar-foreground/80 uppercase">
                Resources
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: item.title }}
                                className="text-sidebar-foreground/90 transition-all duration-200 hover:text-sidebar-foreground"
                                size="sm"
                            >
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    {item.icon && (
                                        <Icon
                                            iconNode={item.icon}
                                            className="mr-2 size-3.5 text-sidebar-foreground/60 transition-colors duration-200 group-hover:text-sidebar-accent-foreground"
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
