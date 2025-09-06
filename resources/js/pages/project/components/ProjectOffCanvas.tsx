import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@inertiajs/react'
import { Building, FileText, FolderPlus, LoaderCircle, Save, Text, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export type Currency = { id: number; user_id: number; code: string }
export type TeamMember = { id: number; name: string; email: string; hourly_rate?: number | null; currency?: string | null; non_monetary?: boolean }
export type Client = { id: number; name: string }

export type ProjectOffCanvasProps = {
    open: boolean
    mode: 'create' | 'edit'
    onClose: () => void
    clients: Client[]
    teamMembers: TeamMember[]
    currencies: Currency[]
    projectId?: number
}

type TeamMemberRate = { hourly_rate: string; currency: string }

type ProjectForm = {
    name: string
    description: string
    client_id: string
    team_members: number[]
    approvers: number[]
    team_member_rates: Record<number, TeamMemberRate>
}

export default function ProjectOffCanvas({ open, mode, onClose, clients, teamMembers, currencies, projectId }: ProjectOffCanvasProps) {
    const isEdit = mode === 'edit'

    const [isImported, setIsImported] = useState(false)
    const [localMembers, setLocalMembers] = useState<TeamMember[]>(teamMembers)

    const { data, setData, post, put, processing, errors, reset } = useForm<ProjectForm>({
        name: '',
        description: '',
        client_id: '',
        team_members: [],
        approvers: [],
        team_member_rates: {},
    })
    useEffect(() => {
        if (open && isEdit && projectId) {
            fetch(route('project.edit-data', projectId))
                .then((r) => r.json())
                .then((payload) => {
                    const p = payload.project
                    setIsImported(!!p?.is_imported)
                    setLocalMembers(payload.teamMembers || teamMembers)

                    const rates: Record<number, TeamMemberRate> = {}
                    if (payload.teamMemberRates) {
                        Object.entries(payload.teamMemberRates as Record<string, { hourly_rate?: number | null; currency?: string | null }>).forEach(
                            ([id, v]) => {
                                rates[Number(id)] = {
                                    hourly_rate: (v?.hourly_rate ?? 0).toString(),
                                    currency: v?.currency ?? currencies[0]?.code ?? 'USD',
                                }
                            },
                        )
                    }

                    setData({
                        name: p.name || '',
                        description: p.description || '',
                        client_id: p.client_id ? String(p.client_id) : '',
                        team_members: payload.assignedTeamMembers || [],
                        approvers: payload.assignedApprovers || [],
                        team_member_rates: rates,
                    })
                })
                .catch(() => {
                    toast.error('Failed to load project')
                    onClose()
                })
        }
        if (open && !isEdit) {
            setIsImported(false)
            setLocalMembers(teamMembers)
            setData({
                name: '',
                description: '',
                client_id: '',
                team_members: [],
                approvers: [],
                team_member_rates: {},
            })
        }
        if (!open) {
            reset()
        }
    }, [open, mode, projectId])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit && projectId) {
            put(route('project.update', projectId), {
                onSuccess: () => {
                    toast.success('Project updated successfully')
                    window.dispatchEvent(new Event('refresh-projects'))
                    onClose()
                },
                onError: () => toast.error('Failed to update project'),
                preserveScroll: true,
            })
        } else {
            post(route('project.store'), {
                onSuccess: () => {
                    toast.success('Project created successfully')
                    window.dispatchEvent(new Event('refresh-projects'))
                    onClose()
                    reset()
                },
                onError: () => toast.error('Failed to create project'),
                preserveScroll: true,
            })
        }
    }

    const handleTeamMemberToggle = (memberId: number) => {
        const currentMembers = [...data.team_members]
        const index = currentMembers.indexOf(memberId)

        if (index === -1) {
            currentMembers.push(memberId)
            const member = localMembers.find((m) => m.id === memberId)
            if (member && !member.non_monetary) {
                const currentRates = { ...data.team_member_rates }
                currentRates[memberId] = {
                    hourly_rate: (member.hourly_rate ?? 0).toString(),
                    currency: member.currency ?? currencies[0]?.code ?? 'USD',
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
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-2xl dark:bg-neutral-900">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        {isEdit ? (
                            <>
                                <Save className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Edit Project
                            </>
                        ) : (
                            <>
                                <FolderPlus className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Add Project
                            </>
                        )}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEdit ? 'Update the project details' : 'Create a new project'}
                    </SheetDescription>
                </SheetHeader>

                <form className="mt-4 flex flex-col gap-8" onSubmit={submit}>
                    <div className="space-y-8">
                        <div className="space-y-5">
                            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Basic Information</h3>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Project Name
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing || isImported}
                                            placeholder="Project name"
                                            className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client_id" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Client <span className="text-xs text-gray-500">(optional)</span>
                                    </Label>
                                    <SearchableSelect
                                        id="client_id"
                                        value={data.client_id}
                                        onChange={(value) => setData('client_id', String(value))}
                                        options={clients}
                                        placeholder="Select a client"
                                        disabled={processing}
                                        icon={<Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                        className="border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                    />
                                    <InputError message={errors.client_id} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Description <span className="text-xs text-gray-500">(optional)</span>
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 top-0 left-3 flex items-center pt-2">
                                        <Text className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Textarea
                                        id="description"
                                        tabIndex={2}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        disabled={processing}
                                        placeholder="Project description"
                                        className="min-h-[100px] border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                    />
                                </div>
                                <InputError message={errors.description} />
                            </div>
                        </div>

                        <div className="space-y-5 pt-2">
                            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Team Assignment</h3>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Team Members <span className="text-xs text-gray-500">(optional)</span>
                                </Label>
                                <div className="relative rounded-md border border-neutral-200 shadow-sm dark:border-neutral-700">
                                    <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800/50">
                                        <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Select team members and set hourly rates
                                        </h3>
                                    </div>
                                    <div className="p-3">
                                        {localMembers && localMembers.length > 0 ? (
                                            <div className="grid gap-2">
                                                {localMembers.map((member) => {
                                                    const isSelected = data.team_members.includes(member.id)
                                                    const showRate = isSelected && !member.non_monetary
                                                    const rate =
                                                        data.team_member_rates[member.id]?.hourly_rate ?? (member.hourly_rate ?? 0).toString()
                                                    return (
                                                        <div
                                                            key={member.id}
                                                            className={`flex flex-wrap items-center gap-3 rounded-md px-3 py-2 transition-colors ${isSelected ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}`}
                                                        >
                                                            <div className="flex min-w-[200px] flex-1 items-center gap-2">
                                                                <Checkbox
                                                                    id={`member-${member.id}`}
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => handleTeamMemberToggle(member.id)}
                                                                    disabled={processing}
                                                                    className="h-4 w-4 border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800"
                                                                />
                                                                <Label
                                                                    htmlFor={`member-${member.id}`}
                                                                    className="cursor-pointer text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                                                >
                                                                    {member.name}
                                                                </Label>
                                                                <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                                    {member.email}
                                                                </span>
                                                            </div>

                                                            {showRate && (
                                                                <div className="ml-auto flex items-center gap-2">
                                                                    <div className="flex h-8 items-center overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                                                        <span className="flex h-full items-center border-r border-neutral-200 bg-neutral-50 px-2 text-xs whitespace-nowrap text-gray-500 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-gray-400">
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
                                                                                currentRates[member.id] = { ...existing, hourly_rate: e.target.value }
                                                                                setData('team_member_rates', currentRates)
                                                                            }}
                                                                            className="h-8 w-20 border-none text-sm tabular-nums focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                            disabled={processing}
                                                                        />
                                                                    </div>

                                                                    <div className="flex h-8 items-center overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                                                        <span className="flex h-full items-center border-r border-neutral-200 bg-neutral-50 px-2 text-xs whitespace-nowrap text-gray-500 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-gray-400">
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
                                                                                className="h-8 w-20 border-none pr-1 pl-2 text-sm focus:ring-0"
                                                                            >
                                                                                <SelectValue placeholder="Currency" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800/50">
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
                                                            {isSelected && !showRate && <div className="ml-auto h-8"></div>}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <p className="py-1 text-sm text-gray-500 dark:text-gray-400">No team members available</p>
                                        )}
                                    </div>
                                </div>
                                <InputError message={errors.team_members} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Project Approvers <span className="text-xs text-gray-500">(optional)</span>
                                </Label>
                                <div className="relative rounded-md border border-neutral-200 p-3 dark:border-neutral-700">
                                    <div className="pointer-events-none absolute top-3 left-3">
                                        <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <div className="space-y-2 pl-7">
                                        {data.team_members.length > 0 ? (
                                            localMembers
                                                .filter((member) => data.team_members.includes(member.id))
                                                .map((member) => (
                                                    <div key={`approver-${member.id}`} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`approver-${member.id}`}
                                                            checked={data.approvers.includes(member.id)}
                                                            onCheckedChange={() => handleApproverToggle(member.id)}
                                                            disabled={processing}
                                                            className="h-4 w-4 border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800"
                                                        />
                                                        <Label
                                                            htmlFor={`approver-${member.id}`}
                                                            className="cursor-pointer text-sm text-neutral-700 dark:text-neutral-300"
                                                        >
                                                            {member.name}{' '}
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">({member.email})</span>
                                                        </Label>
                                                    </div>
                                                ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Select team members first</p>
                                        )}
                                    </div>
                                </div>
                                <InputError message={errors.approvers} />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={processing}
                                className="border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                            >
                                Cancel
                            </Button>
                            <SubmitButton
                                tabIndex={3}
                                loading={processing}
                                idleLabel={isEdit ? 'Update Project' : 'Create Project'}
                                loadingLabel={isEdit ? 'Updating...' : 'Creating...'}
                                idleIcon={isEdit ? <Save className="h-4 w-4" /> : <FolderPlus className="h-4 w-4" />}
                                loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                            />
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
