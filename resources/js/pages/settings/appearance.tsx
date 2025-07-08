import { Head } from '@inertiajs/react';
import { Palette } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Customize how WorkHours looks for you" />

                    <div className="rounded-lg border border-border/40 bg-muted/10 p-6">
                        <div className="mb-4 flex items-start gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Palette className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-base font-medium">Theme Preference</h3>
                                <p className="text-sm text-muted-foreground">Choose your preferred theme mode</p>
                            </div>
                        </div>
                        <AppearanceTabs className="mt-4" />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
