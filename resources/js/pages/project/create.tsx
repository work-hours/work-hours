import { SearchableSelect } from '@/components/ui/searchable-select'
import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft, Building, FileText, FolderPlus, LoaderCircle, Text, Users } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

type TeamMember = {
    id: number
    name: string
    email: string
}

type Client = {
    id: number
    name: string
}

type ProjectForm = {
    name: string
    description: string
    client_id: string
    team_members: number[]
}

type Props = {
    teamMembers: TeamMember[]
    clients: Client[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/project',
    },
    {
        title: 'Create',
        href: '/project/create',
    },
]

export default function CreateProject({ teamMembers, clients }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<ProjectForm>({
        name: '',
        description: '',
        client_id: '',
        team_members: [],
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('project.store'), {
            onSuccess: () => {
                toast.success('Project created successfully')
                reset()
            },
            onError: () => {
                toast.error('Failed to create project')
            },
        })
    }

    const handleTeamMemberToggle = (memberId: number) => {
        const currentMembers = [...data.team_members]
        const index = currentMembers.indexOf(memberId)

        if (index === -1) {
            // Add member if not already selected
            currentMembers.push(memberId)
        } else {
            // Remove member if already selected
            currentMembers.splice(index, 1)
        }

        setData('team_members', currentMembers)
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="mx-auto flex w-10/12 flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add Project</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Create a new project</p>
                </section>

                <Card className="max-w-2xl overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Project Details</CardTitle>
                        <CardDescription>Enter the information for the new project</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Project Name
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Project name"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-sm font-medium">
                                        Description <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 top-0 left-3 flex items-center pt-2">
                                            <Text className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Textarea
                                            id="description"
                                            tabIndex={2}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            disabled={processing}
                                            placeholder="Project description"
                                            className="min-h-[100px] pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="client_id" className="text-sm font-medium">
                                        Client <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <SearchableSelect
                                        id="client_id"
                                        value={data.client_id}
                                        onChange={(value) => setData('client_id', value)}
                                        options={clients}
                                        placeholder="Select a client"
                                        disabled={processing}
                                        icon={<Building className="h-4 w-4 text-muted-foreground" />}
                                    />
                                    <InputError message={errors.client_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">
                                        Team Members <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative rounded-md border p-3">
                                        <div className="pointer-events-none absolute top-3 left-3">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2 pl-7">
                                            {teamMembers && teamMembers.length > 0 ? (
                                                teamMembers.map((member) => (
                                                    <div key={member.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`member-${member.id}`}
                                                            checked={data.team_members.includes(member.id)}
                                                            onCheckedChange={() => handleTeamMemberToggle(member.id)}
                                                            disabled={processing}
                                                        />
                                                        <Label htmlFor={`member-${member.id}`} className="cursor-pointer text-sm">
                                                            {member.name} ({member.email})
                                                        </Label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No team members available</p>
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.team_members} />
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        tabIndex={4}
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" tabIndex={3} disabled={processing} className="flex items-center gap-2">
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
                                        {processing ? 'Creating...' : 'Create Project'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
