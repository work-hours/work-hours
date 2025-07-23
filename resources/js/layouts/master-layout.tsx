import FloatingTimeTracker from '@/components/floating-time-tracker'
import { MasterContent } from '@/components/master-content'
import { MasterSidebar } from '@/components/master-sidebar'
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
            {/* Enhanced paper texture overlay with slightly increased opacity for better visibility */}
            <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA3Ii8+Cjwvc3ZnPg==')] opacity-100 dark:opacity-30"></div>

            {/* Enhanced horizontal lines with slightly increased contrast */}
            <div
                className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:100%_2rem] dark:bg-[linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Enhanced vertical lines with slightly increased contrast */}
            <div
                className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:2rem_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Sidebar */}
            <MasterSidebar collapsed={collapsed} />

            {/* Content */}
            <MasterContent breadcrumbs={breadcrumbs} collapsed={collapsed} setCollapsed={setCollapsed}>
                {children}
            </MasterContent>

            {/* Toaster for notifications with improved positioning */}
            <Toaster position="top-right" closeButton={true} />

            {/* Floating Time Tracker */}
            {dataLoaded && <FloatingTimeTracker projects={userProjects} tasks={userTasks} />}
        </div>
    )
}
