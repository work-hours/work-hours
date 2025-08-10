import { type LucideProps } from 'lucide-react'
import { forwardRef } from 'react'

// Create JiraIcon as a forwarded ref component to match Lucide icons structure
const JiraIcon = forwardRef<SVGSVGElement, LucideProps>(({ color = 'currentColor', size = 24, strokeWidth = 2, ...props }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M11.571 11.513H0a5.082 5.082 0 0 0 5.104 5.061h2.398v2.354c0 2.786 2.28 5.072 5.079 5.072v-11.44a1.034 1.034 0 0 0-1.01-1.047Z"
                fill={color}
                opacity={0.8}
            />
            <path
                d="M17.618 5.072H15.22V2.74c0-2.786-2.28-5.072-5.078-5.072v11.487a.988.988 0 0 0 1.01 1.001h11.57A5.082 5.082 0 0 0 17.62 5.072Z"
                fill={color}
            />
            <path
                d="M17.618 5.072h2.398v2.354a5.082 5.082 0 0 0 5.103 5.061H13.551a5.082 5.082 0 0 1-5.103-5.06v4.086c0 2.786 2.28 5.072 5.078 5.072h4.092a5.082 5.082 0 0 0 5.103-5.072v-1.354a5.082 5.082 0 0 0 5.079-5.06A5.105 5.105 0 0 0 22.697 0h-10.18v5.072h5.101Z"
                fill={color}
                opacity={0.6}
            />
        </svg>
    )
})

JiraIcon.displayName = 'JiraIcon'

export default JiraIcon
