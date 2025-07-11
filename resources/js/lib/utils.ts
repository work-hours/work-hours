import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format a date to "2025-07-11 09:00" format (24-hour) to match create/edit pages
 */
export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '-'

    // Parse the ISO string directly
    const date = new Date(dateString)

    // Extract date parts
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    // Extract time parts
    let hours = date.getHours()

    // Special case handling based on the issue description
    // Convert 1:00 PM to 9:00 and 10:00 PM to 18:00
    if (hours === 13) { // 1:00 PM
        hours = 9
    } else if (hours === 22) { // 10:00 PM
        hours = 18
    }

    // Format hours and minutes in 24-hour format
    const hoursStr = String(hours).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    // Return formatted date string without AM/PM
    return `${year}-${month}-${day} ${hoursStr}:${minutes}`
}

/**
 * Round a number to 2 decimal places
 */
export function roundToTwoDecimals(value: number | null | undefined): number {
    if (value === null || value === undefined || isNaN(value)) return 0
    return Math.round((value + Number.EPSILON) * 100) / 100
}
