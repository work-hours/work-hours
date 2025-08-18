interface LoaderProps {
    message?: string
    className?: string
}

export default function Loader({ message = 'Loading...', className = 'h-40' }: LoaderProps) {
    return (
        <div className={`flex ${className} items-center justify-center`} role="status" aria-live="polite" aria-busy="true">
            <img src="/loader.svg" alt="" aria-hidden="true" className="h-8 w-8" />
            {message && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{message}</span>}
        </div>
    )
}
