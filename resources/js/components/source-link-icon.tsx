import JiraIcon from '@/components/icons/jira-icon'
import { GithubIcon } from 'lucide-react'

type SourceLinkIconProps = {
    source: string
    sourceUrl?: string
}

export default function SourceLinkIcon({ source, sourceUrl }: SourceLinkIconProps) {
    const renderIcon = () => {
        switch (source) {
            case 'github':
                return <GithubIcon className="h-3.5 w-3.5 text-neutral-600 transition-colors duration-200 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200" />
            case 'jira':
                return <JiraIcon className="h-3.5 w-3.5 text-neutral-600 transition-colors duration-200 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200" />
            default:
                return null
        }
    }

    if (!sourceUrl) {
        return renderIcon()
    }

    return (
        <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View in ${source.charAt(0).toUpperCase() + source.slice(1)}`}
            className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
        >
            {renderIcon()}
        </a>
    )
}
