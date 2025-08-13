import { Icon } from '@/components/icon'
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage()
    return (
        <SidebarGroup className="py-2">
            {/* We've removed the title here since it's now handled in the parent component */}
            <SidebarMenu className="space-y-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                            className={`transition-all duration-200 ${
                                page.url.startsWith(item.href)
                                    ? 'border-l-2 border-neutral-600 bg-neutral-50 dark:border-neutral-400 dark:bg-neutral-800/40'
                                    : 'hover:border-l-2 hover:border-neutral-400 hover:bg-neutral-50/80 dark:hover:border-neutral-500 dark:hover:bg-neutral-800/20'
                            }`}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <Icon
                                        iconNode={item.icon}
                                        className={`mr-3 ${
                                            page.url.startsWith(item.href)
                                                ? 'text-neutral-800 dark:text-neutral-200'
                                                : 'text-neutral-600 dark:text-neutral-400'
                                        }`}
                                    />
                                )}
                                <span
                                    className={`${
                                        page.url.startsWith(item.href)
                                            ? 'font-medium text-neutral-800 dark:text-neutral-200'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
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
