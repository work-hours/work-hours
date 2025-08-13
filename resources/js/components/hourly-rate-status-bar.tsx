import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { AlertCircle } from 'lucide-react'

export function HourlyRateStatusBar() {
    const { auth } = usePage<SharedData>().props
    const hourlyRateNotSet = auth.user.hourly_rate === null

    if (!hourlyRateNotSet) {
        return null
    }

    return (
        <Alert variant="destructive" className="mt-4 ml-3 w-10/12 mx-auto border-red-100 bg-red-50 text-red-800 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hourly Rate Required</AlertTitle>
            <AlertDescription className={'flex flex-row items-center justify-between'}>
                <span>
                    Please set your hourly rate in your profile settings for your own projects.
                    <br /> When assigned to a team, the team rate will be used instead.
                </span>

                <Button variant="link" className="h-auto p-0 font-medium text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" asChild>
                    <Link href={route('profile.edit')}>Update Profile</Link>
                </Button>
            </AlertDescription>
        </Alert>
    )
}
