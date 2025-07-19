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
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="bg-[#f8f6e9] border-r-2 border-gray-400 relative"
        >

            {/* Horizontal lines like a timesheet */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem]" aria-hidden="true"></div>

            {/* Vertical lines like a timesheet */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%]" aria-hidden="true"></div>

            <SidebarHeader className="pt-0 pb-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="rounded-none transition-colors hover:bg-gray-100 border-2 border-gray-700 p-2"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarSeparator className="mt-5 bg-gray-400 h-1" />
            </SidebarHeader>

            <SidebarContent className="pt-3">
                {/* Platform Navigation with paper-like styling */}
                <div className="mb-6 px-4">
                    <div className="border-b border-gray-400 pb-2 mb-3">
                        <h3 className="text-sm font-bold text-gray-800 font-['Courier_New',monospace] uppercase tracking-wider">
                            Platform
                        </h3>
                    </div>
                    <NavMain items={mainNavItems} title="Platform" />
                </div>

                {/* Integration Navigation with paper-like styling */}
                {isGitHubIntegrated && (
                    <div className="mb-6 px-4">
                        <div className="border-b border-gray-400 pb-2 mb-3">
                            <h3 className="text-sm font-bold text-gray-800 font-['Courier_New',monospace] uppercase tracking-wider">
                                Integration
                            </h3>
                        </div>
                        <NavMain items={integrationNavItems} title="Integration" />
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter className="pb-5 border-t border-gray-400 pt-4 mt-auto">
                <div className="px-4 mb-4">
                    <h3 className="text-xs font-bold text-gray-700 font-['Courier_New',monospace] uppercase tracking-wider mb-2">
                        Links
                    </h3>
                    <NavFooter items={footerNavItems} className="mt-2" />
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
