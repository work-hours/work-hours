import { type LucideProps } from 'lucide-react'
import { forwardRef } from 'react'

// Create JiraIcon as a forwarded ref component to match Lucide icons structure
const JiraIcon = forwardRef<SVGSVGElement, LucideProps>(({ color = 'currentColor', size = 24, strokeWidth = 2, ...props }, ref) => {
    return (
        <svg
            ref={ref}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M11.5 16L7 11.5L11.5 7" />
            <path d="M16.5 16L12 11.5L16.5 7" />
        </svg>
    )
})

JiraIcon.displayName = 'JiraIcon'

export default JiraIcon
