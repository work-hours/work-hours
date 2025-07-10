// Components
import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react'
import { FormEventHandler } from 'react'

import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/layouts/auth-layout'

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('password.email'))
    }

    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
            <Head title="Forgot password" />

            {status && (
                <div className="mb-6 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={submit} className="flex flex-col gap-6">
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
                                name="email"
                                autoComplete="off"
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="w-full rounded-md py-2.5 font-medium transition-all hover:shadow-md" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>Sending link...</span>
                                </span>
                            ) : (
                                'Email password reset link'
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center gap-2"
                            onClick={() => (window.location.href = route('login'))}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to login</span>
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    <span>Remember your password?</span>{' '}
                    <TextLink href={route('login')} className="font-medium text-primary hover:text-primary/80">
                        Sign in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    )
}
