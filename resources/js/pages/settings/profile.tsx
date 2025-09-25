import { type BreadcrumbItem, type SharedData, type User } from '@/types'
import { Transition } from '@headlessui/react'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { AlertCircle, CheckCircle, DollarSign, Image as ImageIcon, LoaderCircle, Mail, Save, Trash2, Upload, UserCircle, User as UserIcon, X } from 'lucide-react'
import { FormEventHandler, useState, useRef } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MasterLayout from '@/layouts/master-layout'
import SettingsLayout from '@/layouts/settings/layout'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function ProfilePhotoSection() {
    const { auth } = usePage<SharedData>().props
    const photoForm = useForm<{ photo: File | null }>({ photo: null })
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [isConfirmingRemoval, setIsConfirmingRemoval] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            photoForm.setData('photo', file)

            // Create preview URL for the selected image
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]

            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file')
                return
            }

            photoForm.setData('photo', file)

            // Create preview URL
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    function triggerFileInput() {
        fileInputRef.current?.click()
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
                setPreviewUrl(null)
            },
            onError: () => {
                toast.error('Failed to update profile picture')
            },
            preserveScroll: true,
        })
    }

    function startRemovePhoto() {
        setIsConfirmingRemoval(true)
    }

    function cancelRemovePhoto() {
        setIsConfirmingRemoval(false)
    }

    function confirmRemovePhoto() {
        router.delete(route('profile.photo.destroy'), {
            onSuccess: () => {
                toast.success('Profile picture removed')
                setPreviewUrl(null)
                setIsConfirmingRemoval(false)
            },
            onError: () => {
                toast.error('Failed to remove profile picture')
                setIsConfirmingRemoval(false)
            },
            preserveScroll: true,
        })
    }

    function cancelUpload() {
        photoForm.setData('photo', null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const currentPhotoUrl = (auth.user as User).profile_photo_url || '/images/avatar-placeholder.png'
    const displayUrl = previewUrl || currentPhotoUrl

    return (
        <div className="space-y-4">
            {/* Delete Confirmation Dialog */}
            <Dialog open={isConfirmingRemoval} onOpenChange={setIsConfirmingRemoval}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Remove profile picture
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to remove your profile picture? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelRemovePhoto}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={confirmRemovePhoto}
                            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Profile Photo Section */}
            <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 flex-shrink-0">
                    <img
                        src={displayUrl}
                        alt="Profile"
                        className="h-full w-full rounded-full border-2 border-gray-200 object-cover shadow-sm dark:border-gray-700"
                    />
                    {previewUrl && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-gray-900 p-1 text-white dark:bg-white dark:text-gray-900">
                            <span className="sr-only">Preview image</span>
                            <CheckCircle className="h-4 w-4" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <p className="font-medium text-gray-700 dark:text-gray-300">Profile photo</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG or GIF. Maximum size 2MB.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            onClick={triggerFileInput}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1.5"
                        >
                            <Upload className="h-3.5 w-3.5" />
                            Select image
                        </Button>

                        {(auth.user as User).profile_photo_url && (
                            <Button
                                type="button"
                                onClick={startRemovePhoto}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove photo
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={uploadPhoto}>
                <input
                    ref={fileInputRef}
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                />

                <div
                    className={`mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors
                    ${isDragging
                        ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20'
                        : 'border-gray-300 dark:border-gray-700'
                    } ${photoForm.data.photo ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {photoForm.data.photo ? (
                        <div className="flex w-full flex-col items-center space-y-3 text-center">
                            <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{photoForm.data.photo.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(photoForm.data.photo.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={photoForm.processing}
                                    size="sm"
                                    className="bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    {photoForm.processing ? (
                                        <span className="flex items-center gap-1.5">
                                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                            Uploading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5">
                                            <Upload className="h-3.5 w-3.5" />
                                            Upload photo
                                        </span>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelUpload}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 text-center">
                            <div className="rounded-full bg-gray-100 p-2 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                <Upload className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Drag and drop an image, or <button type="button" onClick={triggerFileInput} className="text-blue-600 underline hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400">browse</button>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Supports JPG, PNG and GIF up to 2MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {(photoForm.errors as any)?.photo && (
                    <InputError className="mt-2" message={(photoForm.errors as any).photo} />
                )}
            </form>
        </div>
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
