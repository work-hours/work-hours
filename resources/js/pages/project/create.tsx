import BackButton from '@/components/back-button'
import SubmitButton from '@/components/submit-button'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Head, Link, useForm } from '@inertiajs/react'
import { ArrowLeft, Building, FileText, FolderPlus, LoaderCircle, Text, Users } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

type TeamMember = {
    id: number
    name: string
    email: string
    hourly_rate?: number
    currency?: string
    non_monetary?: boolean
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
    approvers: number[]
    team_member_rates: Record<number, { hourly_rate: string; currency: string }>
}

type Currency = { id: number; user_id: number; code: string }

type Props = {
    teamMembers: TeamMember[]
    clients: Client[]
    currencies: Currency[]
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

export default function CreateProject({ teamMembers, clients, currencies }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<ProjectForm>({
        name: '',
        description: '',
        client_id: '',
        team_members: [],
        approvers: [],
        team_member_rates: {},
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
            currentMembers.push(memberId)
            const member = teamMembers.find((m) => m.id === memberId)
            if (member && !member.non_monetary) {
                const currentRates = { ...data.team_member_rates }
                currentRates[memberId] = {
                    hourly_rate: (member.hourly_rate ?? 0).toString(),
                    currency: member.currency ?? (currencies[0]?.code ?? 'USD'),
                }
                setData('team_member_rates', currentRates)
            }
        } else {
            currentMembers.splice(index, 1)
            const currentRates = { ...data.team_member_rates }
            delete currentRates[memberId]
            setData('team_member_rates', currentRates)
        }

        setData('team_members', currentMembers)

        if (index !== -1 && data.approvers.includes(memberId)) {
            handleApproverToggle(memberId)
        }
    }

    const handleApproverToggle = (memberId: number) => {
        if (!data.team_members.includes(memberId)) {
            return
        }

        const currentApprovers = [...data.approvers]
        const index = currentApprovers.indexOf(memberId)

        if (index === -1) {
            currentApprovers.push(memberId)
        } else {
            currentApprovers.splice(index, 1)
        }

        setData('approvers', currentApprovers)
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="flex items-center gap-4">
                        <Link href={route('project.index')}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="sr-only">Back to Projects</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Add Project</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new project</p>
                        </div>
                    </div>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="text-xl">Project Details</CardTitle>
                        <CardDescription>Enter the information for the new project</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
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
                                    <Label className="text-sm font-medium">
                                        Team Members <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative rounded-md border p-3">
                                        <div className="pointer-events-none absolute top-3 left-3">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2 pl-7">
                                            {teamMembers && teamMembers.length > 0 ? (
                                                teamMembers.map((member) => {
                                                    const isSelected = data.team_members.includes(member.id)
                                                    const showRate = isSelected && !member.non_monetary
                                                    const rate = data.team_member_rates[member.id]?.hourly_rate ?? (member.hourly_rate ?? 0).toString()
                                                    return (
                                                        <div key={member.id} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={`member-${member.id}`}
                                                                checked={isSelected}
                                                                onCheckedChange={() => handleTeamMemberToggle(member.id)}
                                                                disabled={processing}
                                                            />
                                                            <Label htmlFor={`member-${member.id}`} className="cursor-pointer text-sm grow">
                                                                {member.name} ({member.email})
                                                            </Label>
                                                            {showRate && (
                                                                <div className="flex items-center gap-2">
                                                                    <Label htmlFor={`rate-${member.id}`} className="text-xs text-muted-foreground">
                                                                        Hourly
                                                                    </Label>
                                                                    <Input
                                                                        id={`rate-${member.id}`}
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.01"
                                                                        value={rate}
                                                                        onChange={(e) => {
                                                                            const currentRates = { ...data.team_member_rates }
                                                                            const existing = currentRates[member.id] ?? { currency: member.currency ?? (currencies[0]?.code ?? 'USD') }
                                                                            currentRates[member.id] = { ...existing, hourly_rate: e.target.value }
                                                                            setData('team_member_rates', currentRates)
                                                                        }}
                                                                        className="w-28"
                                                                        disabled={processing}
                                                                    />
                                                                    <div className="w-28">
                                                                        <Select
                                                                            value={data.team_member_rates[member.id]?.currency ?? member.currency ?? (currencies[0]?.code ?? 'USD')}
                                                                            onValueChange={(value) => {
                                                                                const currentRates = { ...data.team_member_rates }
                                                                                const existing = currentRates[member.id] ?? { hourly_rate: rate }
                                                                                currentRates[member.id] = { ...existing, currency: value }
                                                                                setData('team_member_rates', currentRates)
                                                                            }}
                                                                            disabled={processing}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Currency" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {(currencies && currencies.length > 0 ? currencies.map((c) => c.code) : ['USD']).map((c) => (
                                                                                    <SelectItem key={c} value={c}>
                                                                                        {c}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No team members available</p>
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.team_members} />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">
                                        Project Approvers <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative rounded-md border p-3">
                                        <div className="pointer-events-none absolute top-3 left-3">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2 pl-7">
                                            {data.team_members.length > 0 ? (
                                                teamMembers
                                                    .filter((member) => data.team_members.includes(member.id))
                                                    .map((member) => (
                                                        <div key={`approver-${member.id}`} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`approver-${member.id}`}
                                                                checked={data.approvers.includes(member.id)}
                                                                onCheckedChange={() => handleApproverToggle(member.id)}
                                                                disabled={processing}
                                                            />
                                                            <Label htmlFor={`approver-${member.id}`} className="cursor-pointer text-sm">
                                                                {member.name} ({member.email})
                                                            </Label>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Select team members first</p>
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.approvers} />
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <BackButton tabIndex={4} disabled={processing} />
                                    <SubmitButton
                                        tabIndex={3}
                                        loading={processing}
                                        idleLabel="Create Project"
                                        loadingLabel="Creating..."
                                        idleIcon={<FolderPlus className="h-4 w-4" />}
                                        loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                                        className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
