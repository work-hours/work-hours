import { Icon } from '@/components/icon'
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage()
    return (
        <SidebarGroup className="py-2">
            {/* We've removed the title here since it's now handled in the parent component */}
            <SidebarMenu className="space-y-2">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                            className={`transition-colors ${
                                page.url.startsWith(item.href)
                                    ? 'border-l-2 border-gray-700 !bg-white bg-white'
                                    : 'hover:border-l-2 hover:border-gray-700 hover:bg-white/70'
                            }`}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <Icon
                                        iconNode={item.icon}
                                        className={`mr-3 ${page.url.startsWith(item.href) ? '!text-gray-900 text-gray-900' : 'text-gray-700'}`}
                                    />
                                )}
                                <span
                                    className={`${
                                        page.url.startsWith(item.href)
                                            ? 'font-bold !text-gray-900 text-gray-900'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
