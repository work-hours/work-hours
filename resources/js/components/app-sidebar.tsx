import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar'
import { type NavItem, type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { Building, Folder, Github, Heart, LayoutGrid, LucideProjector, LucideServerCog, Settings, TimerIcon } from 'lucide-react'
import AppLogo from './app-logo'

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: '/project',
        icon: LucideProjector,
    },
    {
        title: 'Clients',
        href: '/client',
        icon: Building,
    },
    {
        title: 'Team',
        href: '/team',
        icon: LucideServerCog,
    },
    {
        title: 'Time Log',
        href: '/time-log',
        icon: TimerIcon,
    },
    {
        title: 'Integration',
        href: '/integration',
        icon: Settings,
    },
]

const integrationNavItems: NavItem[] = [
    {
        title: 'GitHub',
        href: '/github/repositories',
        icon: Github,
    },
]

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/msamgan/work-hours',
        icon: Folder,
    },
    {
        title: 'Sponsor',
        href: 'https://github.com/sponsors/msamgan',
        icon: Heart,
    },
]

export function AppSidebar() {
    const { isGitHubIntegrated } = usePage<SharedData>().props

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-gradient-to-b from-sidebar via-sidebar/98 to-sidebar/90 shadow-2xl">
            <SidebarHeader className="py-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="rounded-xl transition-all duration-300 hover:scale-105 hover:bg-sidebar-accent/30 hover:shadow-md"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarSeparator className="mt-5 bg-sidebar-border/50" />
            </SidebarHeader>

            <SidebarContent className="pt-3">
                <NavMain items={mainNavItems} title="Platform" />

                {isGitHubIntegrated && <NavMain items={integrationNavItems} title="Integration" />}
            </SidebarContent>

            <SidebarFooter className="pb-5">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
