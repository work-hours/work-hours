import { type BreadcrumbItem, type SharedData } from '@/types'
import { Transition } from '@headlessui/react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { CheckCircle, DollarSign, LoaderCircle, Mail, User } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import DeleteUser from '@/components/delete-user'
import HeadingSmall from '@/components/heading-small'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MasterLayout from '@/layouts/master-layout'
import SettingsLayout from '@/layouts/settings/layout'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
]

type ProfileForm = {
    name: string
    email: string
    hourly_rate: string
    currency: string
}

export default function Profile({ mustVerifyEmail, status, currencies }: { mustVerifyEmail: boolean; status?: string; currencies: string[] }) {
    const { auth } = usePage<SharedData>().props

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        hourly_rate: auth.user.hourly_rate !== null ? String(auth.user.hourly_rate) : '',
        currency: auth.user.currency || 'USD',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile updated successfully')
            },
            onError: () => {
                toast.error('Failed to update profile')
            },
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="name"
                                    className="pl-10"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                            </div>
                            <InputError className="mt-1" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-10"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                            </div>
                            <InputError className="mt-1" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hourly_rate" className="text-sm font-medium">
                                Hourly Rate
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="hourly_rate"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="pl-10"
                                    value={data.hourly_rate}
                                    onChange={(e) => setData('hourly_rate', e.target.value)}
                                    required
                                    placeholder="Hourly rate"
                                />
                            </div>
                            <InputError className="mt-1" message={errors.hourly_rate} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="currency" className="text-sm font-medium">
                                Currency
                            </Label>
                            <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((code: string) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError className="mt-1" message={errors.currency} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-amber-700 dark:text-amber-200">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={route('verification.send')}
                                                method="post"
                                                as="button"
                                                className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-100"
                                            >
                                                Click here to resend the verification email.
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>A new verification link has been sent to your email address.</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} className="flex items-center gap-2">
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Changes</span>
                                )}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Saved successfully</span>
                                </div>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </MasterLayout>
    )
}
