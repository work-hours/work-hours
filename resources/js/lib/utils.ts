import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '-'
    const date = moment.utc(dateString)
    if (!date.isValid()) return '-'
    return date.local().format('YYYY-MM-DD HH:mm')
}

/**
 * Round a number to 2 decimal places
 */
export function roundToTwoDecimals(value: number | null | undefined): number {
    if (value === null || value === undefined || isNaN(value)) return 0
    return Math.round((value + Number.EPSILON) * 100) / 100
}
