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
        <Alert variant="destructive" className="mx-auto mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hourly Rate Required</AlertTitle>
            <AlertDescription className={'flex flex-row items-center justify-between'}>
                <span>
                    Please set your hourly rate in your profile settings for your own projects.
                    <br /> When assigned to a team, the team rate will be used instead.
                </span>

                <Button variant="link" className="h-auto p-0 font-semibold" asChild>
                    <Link href={route('profile.edit')}>Update Profile</Link>
                </Button>
            </AlertDescription>
        </Alert>
    )
}
