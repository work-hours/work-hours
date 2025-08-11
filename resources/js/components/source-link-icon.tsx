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
                return <GithubIcon className="h-3 w-3 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300" />
            case 'jira':
                return <JiraIcon className="h-3 w-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" />
            default:
                return null
        }
    }

    if (!sourceUrl) {
        return renderIcon()
    }

    return (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" title={`View in ${source.charAt(0).toUpperCase() + source.slice(1)}`}>
            {renderIcon()}
        </a>
    )
}
