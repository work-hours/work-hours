import { AppContent } from '@/components/app-content'
import { AppShell } from '@/components/app-shell'
import { AppSidebar } from '@/components/app-sidebar'
import { AppSidebarHeader } from '@/components/app-sidebar-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { AlertCircle } from 'lucide-react'
import { type PropsWithChildren } from 'react'
import { Toaster } from 'sonner'

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<SharedData>().props
    const hourlyRateNotSet = auth.user.hourly_rate === null

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {hourlyRateNotSet && (
                    <Alert variant="destructive" className="mx-auto mt-2 mb-4 w-10/12">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Hourly Rate Required</AlertTitle>
                        <AlertDescription className={'flex flex-row items-center justify-between'}>
                            <span>Please set your hourly rate in your profile settings.</span>
                            <Button variant="link" className="h-auto p-0 font-semibold" asChild>
                                <Link href={route('profile.edit')}>Update Profile</Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}
                {children}
            </AppContent>
            <Toaster position="top-right" />
        </AppShell>
    )
}
