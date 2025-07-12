import { Loader2 } from 'lucide-react'

interface LoaderProps {
    message?: string
    className?: string
}

export default function Loader({ message = 'Loading...', className = 'h-40' }: LoaderProps) {
    return (
        <div className={`flex ${className} items-center justify-center`}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            {message && <span className="ml-2 text-sm text-gray-500">{message}</span>}
        </div>
    )
}
