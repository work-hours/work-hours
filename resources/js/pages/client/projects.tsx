import { ActionButton, ActionButtonGroup } from '@/components/action-buttons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Clock, Edit, FileText, FolderPlus, Mail, Phone, User, Users } from 'lucide-react'

type Project = {
    id: number
    name: string
    description: string | null
    user: {
        id: number
        name: string
        email: string
    }
    team_members: {
        id: number
        name: string
        email: string
    }[]
}

type Client = {
    id: number
    name: string
    email: string | null
    contact_person: string | null
    phone: string | null
    address: string | null
    notes: string | null
    hourly_rate: number | null
    currency: string | null
}

type Props = {
    client: Client
    projects: Project[]
}

export default function ClientProjects({ client, projects }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clients',
            href: '/client',
        },
        {
            title: client.name,
            href: `/client/${client.id}/projects`,
        },
    ]

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} - Projects`} />
            <div className="mx-auto flex flex-col gap-4 p-4">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center gap-4">
                        <Link href={route('client.index')}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="sr-only">Back to Clients</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">{client.name}</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage projects for this client</p>
                        </div>
                    </div>
                </section>

                {/* Client Info Card */}
                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-gray-100">
                            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-700">
                                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </span>
                            Client Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Contact Person
                                    </h3>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.contact_person || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Email
                                    </h3>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.email || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        Phone
                                    </h3>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.phone || 'Not specified'}</p>
                                </div>
                            </div>
                            {client.hourly_rate && (
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">$</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Hourly Rate
                                        </h3>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {client.hourly_rate} {client.currency || 'USD'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Projects Card */}
                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Projects</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    {projects.length > 0
                                        ? `${client.name} has ${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`
                                        : 'No projects found for this client'}
                                </CardDescription>
                            </div>
                            <div>
                                <Link href={route('project.create')}>
                                    <Button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm">
                                        <FolderPlus className="h-4 w-4" />
                                        <span>Add Project</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {projects.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableHeaderRow>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Name</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Description</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Owner</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Team Members</TableHead>
                                            <TableHead className="bg-gray-50 text-right text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Actions</TableHead>
                                        </TableHeaderRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects.map((project) => (
                                            <TableRow key={project.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750">
                                                <TableCell className="py-3">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{project.name}</div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {project.description ? (
                                                        project.description.length > 50 ? (
                                                            project.description.substring(0, 50) + '...'
                                                        ) : (
                                                            project.description
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">No description</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{project.user.name}</TableCell>
                                                <TableCell>
                                                    {project.team_members && project.team_members.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {project.team_members.map((member) => (
                                                                <span
                                                                    key={member.id}
                                                                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                                                                    title={member.email}
                                                                >
                                                                    {member.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">No team members</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ActionButtonGroup>
                                                        <ActionButton
                                                            href={route('project.time-logs', project.id)}
                                                            title="View Time Logs"
                                                            icon={Clock}
                                                            label="Time Logs"
                                                            variant="info"
                                                        />
                                                        <ActionButton
                                                            href={route('project.edit', project.id)}
                                                            title="Edit Project"
                                                            icon={Edit}
                                                            variant="warning"
                                                            size="icon"
                                                        />
                                                    </ActionButtonGroup>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <h3 className="mb-1 text-lg font-medium text-gray-800 dark:text-gray-200">No Projects</h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">This client doesn't have any projects yet.</p>
                                <Link href={route('project.create')}>
                                    <Button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        <FolderPlus className="h-4 w-4" />
                                        <span>Add Project</span>
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
