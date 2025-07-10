import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLImageElement>) {
    return <img src={'/logo.png'} alt="App Logo" className={cn(className)} {...props} />
}
