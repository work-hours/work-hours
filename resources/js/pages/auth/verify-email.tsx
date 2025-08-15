import { Head, useForm } from '@inertiajs/react'
import { LoaderCircle, LogOut, Mail } from 'lucide-react'
import { FormEventHandler } from 'react'

import { Button } from '@/components/ui/button'
import AuthLayout from '@/layouts/auth-layout'

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({})

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('verification.send'))
    }

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-700 dark:border-green-800/30 dark:bg-green-900/10 dark:text-green-400">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <div className="flex flex-col items-center justify-center gap-6">
                <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-900/20">
                    <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>

                <form onSubmit={submit} className="flex w-full flex-col gap-4">
                    <Button
                        disabled={processing}
                        className="flex items-center justify-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                <span>Sending...</span>
                            </span>
                        ) : (
                            <>
                                <Mail className="h-4 w-4" />
                                <span>Resend verification email</span>
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => (window.location.href = route('logout'))}
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                    </Button>
                </form>
            </div>
        </AuthLayout>
    )
}
