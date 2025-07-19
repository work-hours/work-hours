import { MasterSidebar } from '@/components/master-sidebar'
import { MasterContent } from '@/components/master-content'
import { type BreadcrumbItem } from '@/types'
import { type ReactNode } from 'react'
import { Toaster } from 'sonner'

interface MasterLayoutProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export default function MasterLayout({ children, breadcrumbs = [] }: MasterLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#f8f6e9] font-['Courier_New',monospace]">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-100 -z-10"></div>

            {/* Horizontal lines like a timesheet */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem] -z-10" aria-hidden="true"></div>

            {/* Vertical lines like a timesheet */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%] -z-10" aria-hidden="true"></div>

            {/* Sidebar */}
            <MasterSidebar />

            {/* Content */}
            <MasterContent breadcrumbs={breadcrumbs}>
                {children}
            </MasterContent>

            {/* Toaster for notifications */}
            <Toaster position="top-right" />
        </div>
    )
}
