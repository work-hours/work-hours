import CookieConsent from '@/components/cookie-consent'
import FloatingAiChat from '@/components/floating-ai-chat'
import { MasterContent } from '@/components/master-content'
import { MasterRightSidebar } from '@/components/master-right-sidebar'
import { MasterSidebar } from '@/components/master-sidebar'
import { TimeTrackerProvider } from '@/contexts/time-tracker-context'
import { type BreadcrumbItem, SharedData } from '@/types'
import { projects } from '@actions/DashboardController'
import { usePage } from '@inertiajs/react'
import { useEcho } from '@laravel/echo-react'
import { type ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'

interface Project {
    id: number
    name: string
}

interface MasterLayoutProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export default function MasterLayout({ children, breadcrumbs = [] }: MasterLayoutProps) {
    const { auth } = usePage<SharedData>().props
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('sidebar_collapsed')
            return savedState === 'true'
        }

        return false
    })

    const [userProjects, setUserProjects] = useState<Project[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)

    const fetchData = async (): Promise<void> => {
        try {
            const projectsResponse = await projects.data({})
            setUserProjects(projectsResponse.projects)
            setDataLoaded(true)
        } catch (error: unknown) {
            console.error('Failed to fetch data:', error)
        }
    }

    useEcho(`App.Models.User.${auth.user.id}`, 'TaskAssigned', (e) => {
        console.log(e)
    })

    useEffect(() => {
        fetchData().then()
    }, [])

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', String(collapsed))
    }, [])

    useEffect(() => {
        setPageLoaded(true)
        return () => setPageLoaded(false)
    }, [])

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <MasterSidebar collapsed={collapsed} />

            <TimeTrackerProvider>
                <div className={`flex-1 transition-all duration-300 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <MasterContent breadcrumbs={breadcrumbs} collapsed={collapsed} setCollapsed={setCollapsed}>
                        {children}
                    </MasterContent>
                </div>

                <MasterRightSidebar collapsed={collapsed} />
            </TimeTrackerProvider>

            {dataLoaded && (
                <>
                    <FloatingAiChat projects={userProjects} />
                </>
            )}

            <Toaster
                position="top-right"
                closeButton={true}
                toastOptions={{
                    className: 'shadow-md rounded-lg border border-gray-200 dark:border-gray-800',
                    duration: 5000,
                }}
            />

            <CookieConsent />
        </div>
    )
}
