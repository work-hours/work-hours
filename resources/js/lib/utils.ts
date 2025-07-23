import { type ClassValue, clsx } from 'clsx'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'

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

export function objectToQueryString(obj: Record<string, string | number | boolean | Date | null | undefined>): string {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null) {
            if (value instanceof Date && !isNaN(value.getTime())) {
                // Format Date objects as YYYY-MM-DD
                const year = value.getFullYear()
                const month = String(value.getMonth() + 1).padStart(2, '0')
                const day = String(value.getDate()).padStart(2, '0')
                params.append(key, `${year}-${month}-${day}`)
            } else {
                params.append(key, String(value))
            }
        }
    }
    return params.toString()
}

export function queryStringToObject(): Record<string, string> {
    const params = new URLSearchParams(window.location.search)
    const obj: Record<string, string> = {}
    for (const [key, value] of params.entries()) {
        obj[key] = value
    }

    return obj
}
