import InputError from '@/components/input-error'
import MasterLayout from '@/layouts/master-layout'
import SettingsLayout from '@/layouts/settings/layout'
import { type BreadcrumbItem } from '@/types'
import { Transition } from '@headlessui/react'
import { Head, useForm } from '@inertiajs/react'
import { CheckCircle, KeyRound, LoaderCircle, Lock } from 'lucide-react'
import { FormEventHandler, useRef } from 'react'
import { toast } from 'sonner'

import HeadingSmall from '@/components/heading-small'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
]

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null)
    const currentPasswordInput = useRef<HTMLInputElement>(null)

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Password updated successfully')
                reset()
            },
            onError: (errors) => {
                toast.error('Failed to update password')

                if (errors.password) {
                    reset('password', 'password_confirmation')
                    passwordInput.current?.focus()
                }

                if (errors.current_password) {
                    reset('current_password')
                    currentPasswordInput.current?.focus()
                }
            },
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password" className="text-sm font-medium">
                                Current Password
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    type="password"
                                    className="pl-10"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    className="pl-10"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type="password"
                                    className="pl-10"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} className="flex items-center gap-2">
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Update Password</span>
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
                                    <span>Password updated</span>
                                </div>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </MasterLayout>
    )
}
