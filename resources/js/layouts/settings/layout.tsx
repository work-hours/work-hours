import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, Palette, User } from 'lucide-react';
import { type PropsWithChildren } from 'react';

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
        title: 'Appearance',
        href: '/settings/appearance',
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-6 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="mt-6 flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-56">
                    <Card className="overflow-hidden transition-all hover:shadow-sm">
                        <nav className="flex flex-col p-2">
                            {sidebarNavItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={`${item.href}-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('mb-1 w-full justify-start', {
                                            'bg-primary/10 text-primary hover:bg-primary/15': currentPath === item.href,
                                            'hover:bg-muted/80': currentPath !== item.href,
                                        })}
                                    >
                                        <Link href={item.href} prefetch className="flex items-center gap-2">
                                            {Icon && <Icon className="h-4 w-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </Card>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <Card className="overflow-hidden p-6 transition-all hover:shadow-sm">
                        <section className="max-w-xl space-y-12">{children}</section>
                    </Card>
                </div>
            </div>
        </div>
    );
}
