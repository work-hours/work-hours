import { type BreadcrumbItem, type SharedData, type User } from '@/types'
import { Transition } from '@headlessui/react'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { CheckCircle, DollarSign, LoaderCircle, Mail, Save, UserCircle, User as UserIcon } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MasterLayout from '@/layouts/master-layout'
import SettingsLayout from '@/layouts/settings/layout'

function ProfilePhotoSection() {
    const { auth } = usePage<SharedData>().props
    const photoForm = useForm<{ photo: File | null }>({ photo: null })

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            photoForm.setData('photo', e.target.files[0])
        }
    }

    function uploadPhoto(e: React.FormEvent) {
        e.preventDefault()
        if (!photoForm.data.photo) {
            toast.error('Please choose an image file to upload')
            return
        }

        photoForm.post(route('profile.photo.update'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Profile picture updated')
                photoForm.reset()
            },
            onError: () => {
                toast.error('Failed to update profile picture')
            },
            preserveScroll: true,
        })
    }

    function removePhoto() {
        router.delete(route('profile.photo.destroy'), {
            onSuccess: () => toast.success('Profile picture removed'),
            onError: () => toast.error('Failed to remove profile picture'),
            preserveScroll: true,
        })
    }

    return (
        <form onSubmit={uploadPhoto} className="flex items-center gap-4">
            <img
                src={(auth.user as User).profile_photo_url || '/images/avatar-placeholder.png'}
                alt="Profile"
                className="h-16 w-16 rounded-full border border-gray-200 object-cover dark:border-gray-700"
            />

            <div className="flex flex-1 items-center gap-3">
                <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
                <Button
                    type="submit"
                    disabled={photoForm.processing}
                    className="bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    {photoForm.processing ? (
                        <span className="flex items-center gap-2">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Uploading...
                        </span>
                    ) : (
                        'Upload'
                    )}
                </Button>
                <Button type="button" variant="secondary" onClick={removePhoto} className="text-sm">
                    Remove
                </Button>
            </div>
            <InputError className="mt-1" message={(photoForm.errors as any)?.photo} />
        </form>
    )
}

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
    const { auth, isEmployee } = usePage<SharedData>().props

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        hourly_rate: auth.user.hourly_rate !== null ? String(auth.user.hourly_rate) : '',
        currency: auth.user.currency ? auth.user.currency.toString() : 'USD',
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
                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                    <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Profile Picture</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Upload a profile picture to personalize your account
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ProfilePhotoSection />
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                    <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Personal Information</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Manage your profile details and preferences
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
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

                                <div className="grid gap-3">
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

                                {!isEmployee && (
                                    <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="grid gap-3">
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
                                                    required={!isEmployee}
                                                    placeholder="Hourly rate"
                                                />
                                            </div>
                                            <InputError className="mt-1" message={errors.hourly_rate} />
                                        </div>

                                        <div className="grid gap-3">
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
                                    </div>
                                )}

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="mt-2 rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
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

                                <div className="flex items-center justify-end gap-4 pt-2">
                                    <Button
                                        disabled={processing}
                                        className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                <span>Save Changes</span>
                                            </>
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
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </MasterLayout>
    )
}
