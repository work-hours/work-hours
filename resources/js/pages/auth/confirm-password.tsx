// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="space-y-6">
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
                                name="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={data.password}
                                autoFocus
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Button className="w-full rounded-md py-2.5 font-medium transition-all hover:shadow-md" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>Confirming...</span>
                                </span>
                            ) : (
                                'Confirm password'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
