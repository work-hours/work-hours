import CookieConsent from '@/components/cookie-consent'
import FloatingAiChat from '@/components/floating-ai-chat'
import FloatingTimeTracker from '@/components/floating-time-tracker'
import { MasterContent } from '@/components/master-content'
import { MasterRightSidebar } from '@/components/master-right-sidebar'
import { MasterSidebar } from '@/components/master-sidebar'
import Background from '@/components/ui/background'
import { type BreadcrumbItem } from '@/types'
import { projects, tasks } from '@actions/DashboardController'
import { type ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'

interface Project {
    id: number
    name: string
}

interface Task {
    id: number
    title: string
    project_id: number
}

interface MasterLayoutProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export default function MasterLayout({ children, breadcrumbs = [] }: MasterLayoutProps) {
    const [collapsed, setCollapsed] = useState(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('sidebar_collapsed')
            return savedState === 'true'
        }

        return false
    })

    const [userProjects, setUserProjects] = useState<Project[]>([])
    const [userTasks, setUserTasks] = useState<Task[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)

    // Fetch projects and tasks for the time tracker
    const fetchData = async (): Promise<void> => {
        try {
            const [projectsResponse, tasksResponse] = await Promise.all([projects.data({}), tasks.data({})])
            setUserProjects(projectsResponse.projects)
            setUserTasks(tasksResponse.tasks)
            setDataLoaded(true)
        } catch (error: unknown) {
            console.error('Failed to fetch data:', error)
        }
    }

    useEffect(() => {
        fetchData().then()
    }, [])

    // Save collapsed state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', String(collapsed))
    }, [])

    // Add page transition effect
    useEffect(() => {
        setPageLoaded(true)
        return () => setPageLoaded(false)
    }, [])

    return (
        <div className="flex min-h-screen bg-[#f8f6e9] dark:bg-gray-900">
            <Background />

            {/* Left Sidebar */}
            <MasterSidebar collapsed={collapsed} />

            {/* Content */}
            <div className={`flex-1 transition-all duration-300 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <MasterContent breadcrumbs={breadcrumbs} collapsed={collapsed} setCollapsed={setCollapsed}>
                    {children}
                </MasterContent>
            </div>

            {/* Right Sidebar */}
            <MasterRightSidebar collapsed={collapsed} />

            {/* Floating Time Tracker and AI Chat */}
            {dataLoaded && (
                <>
                    <FloatingTimeTracker projects={userProjects} tasks={userTasks} />
                    <FloatingAiChat projects={userProjects} />
                </>
            )}

            {/* Enhanced Toaster for notifications */}
            <Toaster
                position="top-right"
                closeButton={true}
                toastOptions={{
                    className: 'shadow-lg rounded-lg border border-gray-100 dark:border-gray-700',
                    duration: 5000,
                }}
            />

            {/* Cookie Consent Banner */}
            <CookieConsent />
        </div>
    )
}
