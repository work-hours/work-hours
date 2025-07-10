// Components
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
                <div className="mb-6 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <div className="flex flex-col items-center justify-center gap-6">
                <div className="rounded-full bg-primary/10 p-4">
                    <Mail className="h-8 w-8 text-primary" />
                </div>

                <form onSubmit={submit} className="flex w-full flex-col gap-4">
                    <Button
                        disabled={processing}
                        className="flex items-center justify-center gap-2 rounded-md py-2.5 font-medium transition-all hover:shadow-md"
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
                        className="flex items-center justify-center gap-2"
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
