import { MasterContent } from '@/components/master-content'
import { MasterSidebar } from '@/components/master-sidebar'
import { type BreadcrumbItem } from '@/types'
import { type ReactNode, useState, useEffect } from 'react'
import { Toaster } from 'sonner'

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

    // Save collapsed state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', String(collapsed))
    }, [collapsed])

    return (
        <div className="flex min-h-screen bg-[#f8f6e9] font-['Courier_New',monospace]">
            {/* Enhanced paper texture overlay with slightly increased opacity for better visibility */}
            <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA3Ii8+Cjwvc3ZnPg==')] opacity-100"></div>

            {/* Enhanced horizontal lines with slightly increased contrast */}
            <div
                className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:100%_2rem]"
                aria-hidden="true"
            ></div>

            {/* Enhanced vertical lines with slightly increased contrast */}
            <div
                className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:2rem_100%]"
                aria-hidden="true"
            ></div>

            {/* Sidebar */}
            <MasterSidebar collapsed={collapsed} />

            {/* Content */}
            <MasterContent breadcrumbs={breadcrumbs} collapsed={collapsed} setCollapsed={setCollapsed}>{children}</MasterContent>

            {/* Toaster for notifications with improved positioning */}
            <Toaster position="top-right" closeButton={true} />
        </div>
    )
}
