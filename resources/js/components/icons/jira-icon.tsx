import { type LucideProps } from 'lucide-react'
import { forwardRef } from 'react'

const JiraIcon = forwardRef<SVGSVGElement, LucideProps>(({ color = 'currentColor', size = 24, strokeWidth = 2, ...props }, ref) => {
    return (
        <svg
            color={color}
            width={size}
            height={size}
            strokeWidth={strokeWidth}
            ref={ref}
            {...props}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
        >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <defs>
                    <style></style>
                </defs>
                <path
                    className="a"
                    d="M5.5,22.9722h0a8.7361,8.7361,0,0,0,8.7361,8.7361h2.0556v2.0556A8.7361,8.7361,0,0,0,25.0278,42.5h0V22.9722Z"
                ></path>
                <path
                    className="a"
                    d="M14.2361,14.2361h0a8.7361,8.7361,0,0,0,8.7361,8.7361h2.0556v2.0556a8.7361,8.7361,0,0,0,8.7361,8.7361h0V14.2361Z"
                ></path>
                <path className="a" d="M22.9722,5.5h0a8.7361,8.7361,0,0,0,8.7361,8.7361h2.0556v2.0556A8.7361,8.7361,0,0,0,42.5,25.0278h0V5.5Z"></path>
            </g>
        </svg>
    )
})

JiraIcon.displayName = 'JiraIcon'

export default JiraIcon
