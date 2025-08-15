import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
    href: string
    label?: string
    className?: string
}

export function ExportButton({ href, label = 'Export', className = '' }: ExportButtonProps) {
    return (
        <a href={href} className="inline-block">
            <Button
                variant="outline"
                size="default"
                className={`flex items-center gap-2 border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${className}`}
            >
                <Download className="h-4 w-4" />
                <span>{label}</span>
            </Button>
        </a>
    )
}
