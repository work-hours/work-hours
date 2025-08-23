import type { BreadcrumbItem } from '@/types'
import type { ReactNode } from 'react'

declare interface Project {
    id: number
    name: string
}

declare interface MasterLayoutProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}
