import { Head, useForm } from '@inertiajs/react';
import { KeyRound, LoaderCircle, Lock, Mail, User } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
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

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <Lock className="h-4 w-4 text-muted-foreground" />
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

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-medium">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                <KeyRound className="h-4 w-4 text-muted-foreground" />
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

                    <Button
                        type="submit"
                        className="mt-2 w-full rounded-md py-2.5 font-medium transition-all hover:shadow-md"
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

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} className="font-medium text-primary hover:text-primary/80" tabIndex={6}>
                        Sign in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
