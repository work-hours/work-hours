import { MasterLayoutProps, Project } from '@/@types/layouts'
import CookieConsent from '@/components/cookie-consent'
import FloatingAiChat from '@/components/floating-ai-chat'
import { MasterContent } from '@/components/master-content'
import { MasterRightSidebar } from '@/components/master-right-sidebar'
import { MasterSidebar } from '@/components/master-sidebar'
import RealTimeNotification from '@/components/real-time-notification'
import { NotificationsProvider } from '@/contexts/notifications-context'
import { TimeTrackerProvider } from '@/contexts/time-tracker-context'
import { projects } from '@actions/DashboardController'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

export default function MasterLayout({ children, breadcrumbs = [] }: MasterLayoutProps) {
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
        <NotificationsProvider>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 print:bg-white">
                <div className="print:hidden"><MasterSidebar collapsed={collapsed} /></div>

                <TimeTrackerProvider>
                    <div className={`flex-1 transition-all duration-300 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <MasterContent breadcrumbs={breadcrumbs} collapsed={collapsed} setCollapsed={setCollapsed}>
                            {children}
                        </MasterContent>
                    </div>

                    <div className="print:hidden"><MasterRightSidebar collapsed={collapsed} /></div>
                </TimeTrackerProvider>

                {dataLoaded && (
                    <>
                        <div className="print:hidden"><FloatingAiChat projects={userProjects} /></div>
                    </>
                )}

                <div className="print:hidden">
                    <Toaster
                        position="top-right"
                        closeButton={true}
                        toastOptions={{
                            className: 'shadow-md rounded-lg border border-gray-200 dark:border-gray-800',
                            duration: 10000,
                        }}
                    />

                    <CookieConsent />
                    <RealTimeNotification />
                </div>
            </div>
        </NotificationsProvider>
    )
}
