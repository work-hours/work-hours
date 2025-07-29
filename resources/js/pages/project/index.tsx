import DeleteProject from '@/components/delete-project'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { objectToQueryString, queryStringToObject } from '@/lib/utils'
import { projects as _projects } from '@actions/ProjectController'
import { Head, Link, usePage } from '@inertiajs/react'
import { Briefcase, Calendar, CalendarRange, Clock, Download, Edit, FolderPlus, Folders, Loader2, Search, User, X } from 'lucide-react'
import { ChangeEvent, forwardRef, ReactNode, useEffect, useState } from 'react'

interface CustomInputProps {
    value?: string
    onClick?: () => void
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    icon: ReactNode
    placeholder?: string
    disabled?: boolean
    required?: boolean
    autoFocus?: boolean
    tabIndex?: number
    id: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick, onChange, icon, placeholder, disabled, required, autoFocus, tabIndex, id }, ref) => (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{icon}</div>
            <Input
                id={id}
                ref={ref}
                value={value}
                onClick={onClick}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                className="pl-10"
                readOnly={!onChange}
            />
        </div>
    ),
)

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/project',
    },
]

type TeamMember = {
    id: number
    name: string
    email: string
}

type Project = {
    id: number
    name: string
    description: string | null
    team_members: TeamMember[]
    approvers: TeamMember[]
    user: {
        id: number
        name: string
        email: string
    }
    client: Client | null
}

type Client = {
    id: number
    name: string
}

type ProjectFilters = {
    client_id: string
    team_member_id: string
    created_date_from: string | Date | null
    created_date_to: string | Date | null
    search: string
}

type Props = {
    projects: Project[]
    auth: {
        user: {
            id: number
        }
    }
    filters: ProjectFilters
    clients: Client[]
    teamMembers: TeamMember[]
}

export default function Projects() {
    const { auth, filters: pageFilters, clients, teamMembers } = usePage<Props>().props
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [processing, setProcessing] = useState(false)

    // Filter states
    const [filters, setFilters] = useState<ProjectFilters>({
        client_id: pageFilters?.client_id || '',
        team_member_id: pageFilters?.team_member_id || '',
        created_date_from: pageFilters?.created_date_from || null,
        created_date_to: pageFilters?.created_date_to || null,
        search: pageFilters?.search || '',
    })

    const handleFilterChange = (key: keyof ProjectFilters, value: string | number | Date | null): void => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const clearFilters = (): void => {
        setFilters({
            client_id: '',
            team_member_id: '',
            created_date_from: null,
            created_date_to: null,
            search: '',
        })
    }

    const getProjects = async (filters?: ProjectFilters): Promise<void> => {
        setLoading(true)
        setError(false)
        setProcessing(true)
        try {
            setProjects(
                await _projects.data({
                    params: filters,
                }),
            )
        } catch (error) {
            console.error('Error fetching projects:', error)
            setError(true)
        } finally {
            setLoading(false)
            setProcessing(false)
        }
    }

    const formatDateValue = (dateValue: Date | string | null): string => {
        if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0]
        } else if (typeof dateValue === 'string' && dateValue) {
            return dateValue
        }
        return ''
    }

    const handleSubmit = (e: { preventDefault: () => void }): void => {
        e.preventDefault()
        const formattedFilters = { ...filters }

        if (formattedFilters.created_date_from instanceof Date) {
            const year = formattedFilters.created_date_from.getFullYear()
            const month = String(formattedFilters.created_date_from.getMonth() + 1).padStart(2, '0')
            const day = String(formattedFilters.created_date_from.getDate()).padStart(2, '0')
            formattedFilters.created_date_from = `${year}-${month}-${day}`
        }

        if (formattedFilters.created_date_to instanceof Date) {
            const year = formattedFilters.created_date_to.getFullYear()
            const month = String(formattedFilters.created_date_to.getMonth() + 1).padStart(2, '0')
            const day = String(formattedFilters.created_date_to.getDate()).padStart(2, '0')
            formattedFilters.created_date_to = `${year}-${month}-${day}`
        }

        const filtersString = objectToQueryString(formattedFilters)

        getProjects(formattedFilters).then(() => {
            window.history.pushState({}, '', `?${filtersString}`)
        })
    }

    useEffect(() => {
        const queryParams = queryStringToObject()

        const initialFilters: ProjectFilters = {
            client_id: queryParams.client_id || '',
            team_member_id: queryParams.team_member_id || '',
            created_date_from: queryParams.created_date_from || null,
            created_date_to: queryParams.created_date_to || null,
            search: queryParams.search || '',
        }

        setFilters(initialFilters)
        getProjects(initialFilters).then()
    }, [])

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="mx-auto flex flex-col gap-6 p-3">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Project Management</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your projects</p>
                </section>

                {/* Filters card */}
                <Card className="transition-all hover:shadow-md">
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-6">
                            {/* Search */}
                            <div className="grid gap-1">
                                <Label htmlFor="search" className="text-xs font-medium">
                                    Search
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search"
                                        className="pl-10"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Client Filter */}
                            <div className="grid gap-1">
                                <Label htmlFor="client" className="text-xs font-medium">
                                    Client
                                </Label>
                                <SearchableSelect
                                    id="client"
                                    value={filters.client_id}
                                    onChange={(value) => handleFilterChange('client_id', value)}
                                    options={[
                                        { id: '', name: 'All Clients' },
                                        ...clients.map((client) => ({
                                            id: client.id.toString(),
                                            name: client.name,
                                        })),
                                    ]}
                                    placeholder="All Clients"
                                    disabled={processing}
                                    icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                                />
                            </div>

                            {/* Team Member Filter */}
                            <div className="grid gap-1">
                                <Label htmlFor="team-member" className="text-xs font-medium">
                                    Team Member
                                </Label>
                                <SearchableSelect
                                    id="team-member"
                                    value={filters.team_member_id}
                                    onChange={(value) => handleFilterChange('team_member_id', value)}
                                    options={[
                                        { id: '', name: 'All Team Members' },
                                        ...teamMembers.map((member) => ({
                                            id: member.id.toString(),
                                            name: member.name,
                                        })),
                                    ]}
                                    placeholder="All Team Members"
                                    disabled={processing}
                                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                                />
                            </div>

                            {/* Created Date From */}
                            <div className="grid gap-1">
                                <Label htmlFor="created-date-from" className="text-xs font-medium">
                                    Created Date From
                                </Label>
                                <DatePicker
                                    selected={filters.created_date_from}
                                    onChange={(date) => handleFilterChange('created_date_from', date)}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    disabled={processing}
                                    customInput={
                                        <CustomInput
                                            id="created-date-from"
                                            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                                            disabled={processing}
                                            placeholder="Select start date"
                                        />
                                    }
                                />
                            </div>

                            {/* Created Date To */}
                            <div className="grid gap-1">
                                <Label htmlFor="created-date-to" className="text-xs font-medium">
                                    Created Date To
                                </Label>
                                <DatePicker
                                    selected={filters.created_date_to}
                                    onChange={(date) => handleFilterChange('created_date_to', date)}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    disabled={processing}
                                    customInput={
                                        <CustomInput
                                            id="created-date-to"
                                            icon={<CalendarRange className="h-4 w-4 text-muted-foreground" />}
                                            disabled={processing}
                                            placeholder="Select end date"
                                        />
                                    }
                                />
                            </div>

                            <div className="flex items-end gap-2">
                                <Button type="submit" className="flex h-9 items-center gap-1 px-3">
                                    <Search className="h-3.5 w-3.5" />
                                    <span>Filter</span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        !filters.client_id &&
                                        !filters.team_member_id &&
                                        !filters.created_date_from &&
                                        !filters.created_date_to &&
                                        !filters.search
                                    }
                                    onClick={clearFilters}
                                    className="flex h-9 items-center gap-1 px-3"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Clear</span>
                                </Button>
                            </div>
                        </form>

                        <div className={'mt-4 text-sm text-muted-foreground'}>
                            {(filters.client_id ||
                                filters.team_member_id ||
                                filters.created_date_from ||
                                filters.created_date_to ||
                                filters.search) && (
                                <CardDescription>
                                    {(() => {
                                        let description = ''

                                        if (filters.created_date_from && filters.created_date_to) {
                                            description = `Showing projects from ${formatDateValue(filters.created_date_from)} to ${formatDateValue(filters.created_date_to)}`
                                        } else if (filters.created_date_from) {
                                            description = `Showing projects from ${formatDateValue(filters.created_date_from)}`
                                        } else if (filters.created_date_to) {
                                            description = `Showing projects until ${formatDateValue(filters.created_date_to)}`
                                        }

                                        if (filters.client_id) {
                                            const client = clients.find((c) => c.id.toString() === filters.client_id)
                                            if (client) {
                                                if (description) {
                                                    description += ` for client "${client.name}"`
                                                } else {
                                                    description = `Showing projects for client "${client.name}"`
                                                }
                                            }
                                        }

                                        if (filters.team_member_id) {
                                            const member = teamMembers.find((m) => m.id.toString() === filters.team_member_id)
                                            if (member) {
                                                if (description) {
                                                    description += ` with team member "${member.name}"`
                                                } else {
                                                    description = `Showing projects with team member "${member.name}"`
                                                }
                                            }
                                        }

                                        if (filters.search) {
                                            if (description) {
                                                description += ` matching "${filters.search}"`
                                            } else {
                                                description = `Showing projects matching "${filters.search}"`
                                            }
                                        }

                                        return description
                                    })()}
                                </CardDescription>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Projects card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Projects</CardTitle>
                                <CardDescription>
                                    {loading ? 'Loading projects...' : error ? 'Failed to load projects' : `You have ${projects.length} projects`}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`${route('project.export')}?${objectToQueryString({
                                        client_id: filters.client_id || '',
                                        team_member_id: filters.team_member_id || '',
                                        created_date_from: formatDateValue(filters.created_date_from),
                                        created_date_to: formatDateValue(filters.created_date_to),
                                        search: filters.search || '',
                                    })}`}
                                    className="inline-block"
                                >
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span>Export</span>
                                    </Button>
                                </a>
                                <Link href={route('project.create')}>
                                    <Button className="flex items-center gap-2">
                                        <FolderPlus className="h-4 w-4" />
                                        <span>Add Project</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Loader2 className="mb-4 h-12 w-12 animate-spin text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-medium">Loading Projects</h3>
                                <p className="mb-4 text-muted-foreground">Please wait while we fetch your projects...</p>
                            </div>
                        ) : error ? (
                            <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Folders className="mb-4 h-12 w-12 text-red-500" />
                                    <h3 className="mb-1 text-lg font-medium text-red-700 dark:text-red-400">Failed to Load Projects</h3>
                                    <p className="mb-4 text-red-600 dark:text-red-300">There was an error loading your projects. Please try again.</p>
                                    <Button onClick={() => getProjects()} className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4" />
                                        <span>Retry</span>
                                    </Button>
                                </div>
                            </div>
                        ) : projects.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Team Members</TableHead>
                                        <TableHead>Approvers</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.name}</TableCell>
                                            <TableCell>
                                                {project.client ? project.client.name : <span className="text-muted-foreground/50">No client</span>}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {project.description ? (
                                                    project.description.length > 50 ? (
                                                        project.description.substring(0, 50) + '...'
                                                    ) : (
                                                        project.description
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground/50">No description</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{project.user.name}</TableCell>
                                            <TableCell>
                                                {project.team_members && project.team_members.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.team_members.map((member) => (
                                                            <span
                                                                key={member.id}
                                                                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
                                                                title={member.email}
                                                            >
                                                                {member.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/50">No team members</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {project.approvers && project.approvers.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.approvers.map((approver) => (
                                                            <span
                                                                key={approver.id}
                                                                className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700/10 ring-inset dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30"
                                                                title={approver.email}
                                                            >
                                                                {approver.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/50">No approvers</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {project.user.id === auth.user.id && (
                                                        <>
                                                            <Link href={route('project.time-logs', project.id)}>
                                                                <Button variant="outline" size="sm" className="h-8">
                                                                    <Clock className="mr-1 h-3.5 w-3.5" />
                                                                    Time Logs
                                                                </Button>
                                                            </Link>
                                                            <Link href={route('project.edit', project.id)}>
                                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                                    <Edit className="h-3.5 w-3.5" />
                                                                    <span className="sr-only">Edit</span>
                                                                </Button>
                                                            </Link>
                                                            <DeleteProject projectId={project.id} onDelete={() => getProjects(filters)} />
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Folders className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Projects</h3>
                                    <p className="mb-4 text-muted-foreground">You haven't added any projects yet.</p>
                                    <Link href={route('project.create')}>
                                        <Button className="flex items-center gap-2">
                                            <FolderPlus className="h-4 w-4" />
                                            <span>Add Project</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
