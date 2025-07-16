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
        <Alert variant="destructive" className="mx-auto mt-2 mb-4 w-10/12">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hourly Rate Required</AlertTitle>
            <AlertDescription className={'flex flex-row items-center justify-between'}>
                <span>Please set your hourly rate in your profile settings.</span>
                <Button variant="link" className="h-auto p-0 font-semibold" asChild>
                    <Link href={route('profile.edit')}>Update Profile</Link>
                </Button>
            </AlertDescription>
        </Alert>
    )
}
