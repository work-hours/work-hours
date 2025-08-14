import { Head } from '@inertiajs/react'
import { Palette } from 'lucide-react'

import AppearanceTabs from '@/components/appearance-tabs'
import HeadingSmall from '@/components/heading-small'
import { type BreadcrumbItem } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import MasterLayout from '@/layouts/master-layout'
import SettingsLayout from '@/layouts/settings/layout'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
]

export default function Appearance() {
    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Customize how WorkHours looks for you" />

                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                    <Palette className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Theme Preference</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Choose your preferred theme mode
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <AppearanceTabs className="mt-2" />
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </MasterLayout>
    )
}
