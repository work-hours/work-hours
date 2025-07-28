import CookieConsent from '@/components/cookie-consent'
import FloatingAiChat from '@/components/floating-ai-chat'
import FloatingTimeTracker from '@/components/floating-time-tracker'
import { MasterContent } from '@/components/master-content'
import { MasterRightSidebar } from '@/components/master-right-sidebar'
import { MasterSidebar } from '@/components/master-sidebar'
import Background from '@/components/ui/background'
import { type BreadcrumbItem } from '@/types'
import { type ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { projects, tasks } from '@actions/DashboardController'

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
    }, [collapsed])

    return (
        <div className="flex min-h-screen bg-[#f8f6e9] dark:bg-gray-900">
            <Background />

            {/* Left Sidebar */}
            <MasterSidebar collapsed={collapsed} />

            {/* Content */}
            <MasterContent breadcrumbs={breadcrumbs} collapsed={collapsed} setCollapsed={setCollapsed}>
                {children}
            </MasterContent>

            {/* Right Sidebar */}
            {dataLoaded && <MasterRightSidebar collapsed={collapsed} />}

            {/* Floating Time Tracker and AI Chat */}
            {dataLoaded && (
                <>
                    <FloatingTimeTracker projects={userProjects} tasks={userTasks} />
                    <FloatingAiChat projects={userProjects} />
                </>
            )}

            {/* Toaster for notifications with improved positioning */}
            <Toaster position="top-right" closeButton={true} />

            {/* Cookie Consent Banner */}
            <CookieConsent />
        </div>
    )
}
