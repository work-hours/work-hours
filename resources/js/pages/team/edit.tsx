import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type TeamMemberForm = {
    name: string;
    email: string;
    password?: string; // Password is optional for editing
};

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
    {
        title: 'Edit',
        href: '/team/edit',
    },
];

export default function EditTeamMember({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm<TeamMemberForm>({
        name: user.name,
        email: user.email,
        password: '', // Empty by default since it's optional
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('team.update', user.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Team Member" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Edit Team Member</h2>
                </div>

                <div className="max-w-2xl rounded-md border p-6">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
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
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
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
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password (leave empty to keep current password)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="New Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()} tabIndex={5} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="submit" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Team Member
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
