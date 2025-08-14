import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { type NavItem } from '@/types'
import { Link } from '@inertiajs/react'
import { DollarSign, KeyRound, Palette, Settings2, User } from 'lucide-react'
import { type PropsWithChildren } from 'react'

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: User,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: KeyRound,
    },
    {
        title: 'Currency',
        href: '/settings/currency',
        icon: DollarSign,
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: Palette,
    },
]

export default function SettingsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') {
        return null
    }

    const currentPath = window.location.pathname

    return (
        <div className="mx-auto w-10/12 px-6 py-6">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                    <Settings2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <Heading title="Settings" description="Manage your profile and account settings" />
            </div>

            <div className="mt-8 flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-64">
                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Navigation</h3>
                        </div>
                        <nav className="flex flex-col p-2">
                            {sidebarNavItems.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <Button
                                        key={`${item.href}-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('mb-2 w-full justify-start px-3 py-2 text-sm text-gray-800', {
                                            'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600':
                                                currentPath === item.href,
                                            'hover:bg-gray-100 dark:hover:bg-gray-800': currentPath !== item.href,
                                        })}
                                    >
                                        <Link href={item.href} prefetch className="flex items-center gap-3">
                                            {Icon && <Icon className="h-4 w-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </Button>
                                )
                            })}
                        </nav>
                    </Card>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-3xl">{children}</div>
            </div>
        </div>
    )
}
