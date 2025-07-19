import DeleteProject from '@/components/delete-project'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { projects as _projects } from '@actions/ProjectController'
import { Head, Link } from '@inertiajs/react'
import { Clock, Download, Edit, FolderPlus, Folders, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    user: {
        id: number
        name: string
        email: string
    }
}

type Props = {
    projects: Project[]
    auth: {
        user: {
            id: number
        }
    }
}

export default function Projects({ auth }: Props) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const getProjects = async () => {
        setLoading(true)
        setError(false)
        try {
            setProjects(await _projects.data({}))
        } catch (error) {
            console.error('Error fetching projects:', error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProjects().then()
    }, [])

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="mx-auto flex w-10/12 flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Project Management</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your projects</p>
                </section>

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
                                <a href={route('project.export')} className="inline-block">
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
                                        <TableHead>Description</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Team Members</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.name}</TableCell>
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
                                                            <DeleteProject projectId={project.id} />
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
