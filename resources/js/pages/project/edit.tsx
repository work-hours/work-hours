import BackButton from '@/components/back-button'
import SubmitButton from '@/components/submit-button'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Head, useForm } from '@inertiajs/react'
import { Building, FileText, LoaderCircle, Save, Text, Users } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

import type { ProjectForm, EditProjectProps as Props } from '@/@types/project'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/project',
    },
    {
        title: 'Edit',
        href: '/project/edit',
    },
]

export default function EditProject({ project, teamMembers, assignedTeamMembers, assignedApprovers, teamMemberRates, clients, currencies }: Props) {
    const { data, setData, put, processing, errors } = useForm<ProjectForm>({
        name: project.name,
        description: project.description || '',
        client_id: project.client_id ? project.client_id.toString() : '',
        team_members: assignedTeamMembers || [],
        approvers: assignedApprovers || [],
        team_member_rates: Object.fromEntries(
            Object.entries(teamMemberRates || {}).map(([id, v]) => [
                Number(id),
                { hourly_rate: (v?.hourly_rate ?? 0).toString(), currency: v?.currency ?? currencies[0]?.code ?? 'USD' },
            ]),
        ),
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('project.update', project.id), {
            onSuccess: () => {
                toast.success('Project updated successfully')
            },
            onError: () => {
                toast.error('Failed to update project')
            },
        })
    }

    const handleTeamMemberToggle = (memberId: number) => {
        const currentMembers = [...data.team_members]
        const index = currentMembers.indexOf(memberId)

        if (index === -1) {
            currentMembers.push(memberId)
        } else {
            currentMembers.splice(index, 1)
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
            <Head title="Edit Project" />
            <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Edit Project</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update information for {project.name}</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="text-xl">Project Information</CardTitle>
                        <CardDescription>Update the project's details</CardDescription>
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
                                                disabled={processing || project.is_imported}
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
                                    <div className="relative rounded-md border border-gray-200 shadow-sm dark:border-gray-700">
                                        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="text-sm font-medium">Select team members and set hourly rates</h3>
                                        </div>
                                        <div className="p-2">
                                            {teamMembers && teamMembers.length > 0 ? (
                                                <div className="grid gap-2">
                                                    {teamMembers.map((member) => {
                                                        const isSelected = data.team_members.includes(member.id)
                                                        const showRate = isSelected && !member.non_monetary
                                                        const rate =
                                                            data.team_member_rates[member.id]?.hourly_rate ?? (member.hourly_rate ?? 0).toString()
                                                        return (
                                                            <div
                                                                key={member.id}
                                                                className={`flex flex-wrap items-center gap-2 px-2 py-1.5 transition-colors ${
                                                                    isSelected ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                                                                }`}
                                                            >
                                                                <div className="flex min-w-[200px] flex-1 items-center gap-2">
                                                                    <Checkbox
                                                                        id={`member-${member.id}`}
                                                                        checked={isSelected}
                                                                        onCheckedChange={() => handleTeamMemberToggle(member.id)}
                                                                        disabled={processing}
                                                                        className="h-3.5 w-3.5"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`member-${member.id}`}
                                                                        className="cursor-pointer text-sm font-medium"
                                                                    >
                                                                        {member.name}
                                                                    </Label>
                                                                    <span className="truncate text-xs text-muted-foreground">{member.email}</span>
                                                                </div>

                                                                {showRate && (
                                                                    <div className="ml-auto flex items-center gap-1">
                                                                        <div className="flex h-7 items-center overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                            <span className="flex h-full items-center border-r border-gray-200 bg-gray-50 px-2 text-xs whitespace-nowrap text-muted-foreground dark:border-gray-700 dark:bg-gray-800/80">
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="h-3 w-3"
                                                                                    aria-label="Rate"
                                                                                >
                                                                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                                                                </svg>
                                                                            </span>
                                                                            <Input
                                                                                id={`rate-${member.id}`}
                                                                                type="number"
                                                                                min="0"
                                                                                step="0.01"
                                                                                value={rate}
                                                                                onChange={(e) => {
                                                                                    const currentRates = { ...data.team_member_rates }
                                                                                    const existing = currentRates[member.id] ?? {
                                                                                        currency: member.currency ?? currencies[0]?.code ?? 'USD',
                                                                                    }
                                                                                    currentRates[member.id] = {
                                                                                        ...existing,
                                                                                        hourly_rate: e.target.value,
                                                                                    }
                                                                                    setData('team_member_rates', currentRates)
                                                                                }}
                                                                                className="h-7 w-20 border-none text-sm tabular-nums focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                                disabled={processing}
                                                                            />
                                                                        </div>

                                                                        <div className="flex h-7 items-center overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                            <span className="flex h-full items-center border-r border-gray-200 bg-gray-50 px-2 text-xs whitespace-nowrap text-muted-foreground dark:border-gray-700 dark:bg-gray-800/80">
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="h-3 w-3"
                                                                                    aria-label="Currency"
                                                                                >
                                                                                    <circle cx="12" cy="12" r="8" />
                                                                                    <path d="M9.5 9a2.5 2.5 0 0 1 5 0v6a2.5 2.5 0 0 1-5 0" />
                                                                                </svg>
                                                                            </span>
                                                                            <Select
                                                                                value={
                                                                                    data.team_member_rates[member.id]?.currency ??
                                                                                    member.currency ??
                                                                                    currencies[0]?.code ??
                                                                                    'USD'
                                                                                }
                                                                                onValueChange={(value) => {
                                                                                    const currentRates = { ...data.team_member_rates }
                                                                                    const existing = currentRates[member.id] ?? { hourly_rate: rate }
                                                                                    currentRates[member.id] = { ...existing, currency: value }
                                                                                    setData('team_member_rates', currentRates)
                                                                                }}
                                                                                disabled={processing}
                                                                            >
                                                                                <SelectTrigger
                                                                                    id={`currency-${member.id}`}
                                                                                    className="h-7 w-20 border-none pr-1 pl-2 text-sm focus:ring-0"
                                                                                >
                                                                                    <SelectValue placeholder="Currency" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {(currencies && currencies.length > 0
                                                                                        ? currencies.map((c) => c.code)
                                                                                        : ['USD']
                                                                                    ).map((c) => (
                                                                                        <SelectItem key={c} value={c}>
                                                                                            {c}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {isSelected && !showRate && <div className="ml-auto h-7"></div>}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="py-1 text-sm text-muted-foreground">No team members available</p>
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
                                        idleLabel="Update Project"
                                        loadingLabel="Updating..."
                                        idleIcon={<Save className="h-4 w-4" />}
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
