import type { BreadcrumbItem, NavItem } from '@/types'
import type { Dispatch, ElementType, ReactNode, SetStateAction } from 'react'

declare interface MasterSidebarProps {
    collapsed: boolean
}

declare interface NavItemGroup {
    title: string
    icon?: ElementType
    items: NavItem[]
}

declare interface MasterContentProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
    collapsed: boolean
    setCollapsed: Dispatch<SetStateAction<boolean>>
}
