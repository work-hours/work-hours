export default function Heading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-8 space-y-0.5">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">{title}</h2>
            {description && <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
        </div>
    )
}
