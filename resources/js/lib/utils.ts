import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date to "january 1, 2025 3:30 AM" format
 */
export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    const date = new Date(dateString);

    return date
        .toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        .toLowerCase();
}

/**
 * Round a number to 2 decimal places
 */
export function roundToTwoDecimals(value: number | null | undefined): number {
    if (value === null || value === undefined || isNaN(value)) return 0;
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
