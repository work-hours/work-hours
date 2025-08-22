import type { NavItem } from '@/types'
import type { ElementType } from 'react'

declare interface MasterSidebarProps {
    collapsed: boolean
}

declare interface NavItemGroup {
    title: string
    icon?: ElementType
    items: NavItem[]
}
