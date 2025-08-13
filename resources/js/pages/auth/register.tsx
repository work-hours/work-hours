import { Head, useForm } from '@inertiajs/react'
import { KeyRound, LoaderCircle, Lock, Mail, User } from 'lucide-react'
import { FormEventHandler } from 'react'

import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/layouts/auth-layout'

type RegisterForm = {
    name: string
    email: string
    password: string
    password_confirmation: string
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Name field with typewriter styling */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-bold text-gray-800 uppercase dark:text-gray-200">
                            Full Name
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <User className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Email field with typewriter styling */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-bold text-gray-800 uppercase dark:text-gray-200">
                            Email Address
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <Mail className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Password field with typewriter styling */}
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-bold text-gray-800 uppercase dark:text-gray-200">
                            Password
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <Lock className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password field with typewriter styling */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-bold text-gray-800 uppercase dark:text-gray-200">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <KeyRound className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </div>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit button with timesheet styling */}
                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        tabIndex={5}
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                <span>Creating account...</span>
                            </span>
                        ) : (
                            'Create account'
                        )}
                    </Button>
                </div>

                {/* Sign in link with timesheet styling */}
                <div className="text-center text-sm text-gray-700 dark:text-gray-300">
                    Already have an account?{' '}
                    <TextLink
                        href={route('login')}
                        className="border-b border-gray-400 pb-0.5 font-bold text-gray-700 hover:border-gray-700 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100"
                        tabIndex={6}
                    >
                        Sign in
                    </TextLink>
                </div>
            </form>

            {/* Divider with timesheet styling */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-400/40 dark:border-gray-600/40"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="border-x border-gray-400/40 bg-white px-2 text-gray-700 dark:border-gray-600/40 dark:bg-gray-800 dark:text-gray-300">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Social login buttons with timesheet styling */}
            <div className="flex flex-col gap-2">
                <a
                    href={route('auth.google')}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#eff6ff] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign up with Google
                </a>

                <a
                    href={route('auth.github')}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#eff6ff] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Sign up with GitHub
                </a>
            </div>
        </AuthLayout>
    )
}
