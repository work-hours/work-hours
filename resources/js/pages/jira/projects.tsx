import { Head, Link } from '@inertiajs/react'
import axios from 'axios'
import { ArrowLeft, ExternalLink, Loader2, Search, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { toast } from 'sonner'

type Project = {
    id: string
    key: string
    name: string
    description?: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integration',
        href: '/integration',
    },
    {
        title: 'Jira Projects',
        href: '/jira/projects',
    },
]

export default function JiraProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [importedProjectKeys, setImportedProjectKeys] = useState<string[]>([])
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [importingProject, setImportingProject] = useState<string | null>(null)
    const [hasCredentials, setHasCredentials] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const showMessage = (message: string, isError = false) => {
        if (isError) {
            toast.error(message)
        } else {
            toast.success(message)
        }
    }

    useEffect(() => {
        fetchProjects().then()
    }, [])

    const fetchProjects = async () => {
        setLoadingProjects(true)
        try {
            const response = await axios.get(route('jira.projects.list'))
            setProjects(response.data.projects)
            setImportedProjectKeys(response.data.importedProjectKeys || [])
            setHasCredentials(true)
        } catch (error: any) {
            console.error('Error fetching projects:', error)

            if (error.response?.status === 400 && error.response?.data?.message?.includes('credentials')) {
                setHasCredentials(false)
            } else {
                showMessage(error.response?.data?.message || 'Could not fetch projects from Jira.', true)
            }

            setProjects([])
        } finally {
            setLoadingProjects(false)
        }
    }

    const importProject = async (project: Project) => {
        setImportingProject(project.key)
        try {
            await axios.post(route('jira.projects.import'), {
                key: project.key,
                name: project.name,
                description: project.description,
            })

            showMessage(`Successfully imported ${project.name} and its issues.`)

            setImportedProjectKeys((prev) => [...prev, project.key])
        } catch (error: any) {
            console.error('Error importing project:', error)
            showMessage(error.response?.data?.message || `Failed to import ${project.name}.`, true)
        } finally {
            setImportingProject(null)
        }
    }

    const isProjectImported = (projectKey: string): boolean => {
        return importedProjectKeys.includes(projectKey)
    }

    if (!hasCredentials) {
        return (
            <MasterLayout breadcrumbs={breadcrumbs}>
                <Head title="Jira Projects" />
                <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
                    <section className="mb-2">
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Jira Projects</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Connect and manage your Jira projects</p>
                    </section>

                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="mb-4 rounded-full bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-200">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Jira Credentials Required</h3>
                            <p className="mb-4 max-w-md text-muted-foreground">
                                You need to connect your Jira account before you can view and import projects.
                            </p>
                            <Button asChild>
                                <Link href={route('jira.connect')}>Connect to Jira</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </MasterLayout>
        )
    }

    const filteredProjects = projects.filter(
        (project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            project.key.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Jira Projects" />
            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Jira Projects</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Browse and import your Jira projects</p>
                </section>

                <div className="flex items-center justify-between">
                    <Button variant="outline" asChild>
                        <Link href={route('jira.connect')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Change Credentials
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col space-y-8">
                    <div className="flex-1 md:max-w-5xl">
                        <Card className="overflow-hidden transition-all hover:shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Shield className="h-5 w-5" />
                                    Import Jira Projects
                                </CardTitle>
                                <CardDescription>Browse and select Jira projects to import into the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Search input */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search projects..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {loadingProjects ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="mb-6 rounded-full bg-primary/10 p-4">
                                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-medium">Loading Projects</h3>
                                        <p className="text-sm text-muted-foreground">Fetching projects from Jira...</p>
                                    </div>
                                ) : filteredProjects.length > 0 ? (
                                    <ScrollArea className="h-[450px] pr-2">
                                        <div className="space-y-4">
                                            {filteredProjects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-all hover:bg-accent/10 hover:shadow-md"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 text-lg font-medium">
                                                                <Shield className="h-4 w-4 text-primary" />
                                                                {project.name}
                                                                <Badge
                                                                    variant="outline"
                                                                    className="ml-1 border-blue-200 bg-blue-100 text-xs font-normal text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                                >
                                                                    {project.key}
                                                                </Badge>
                                                            </div>
                                                            {project.description && (
                                                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                                    {project.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {isProjectImported(project.key) ? (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="mr-2 border-green-200 bg-green-100 p-2 text-green-700 dark:border-green-800 dark:bg-green-900 dark:text-green-300"
                                                                >
                                                                    Imported
                                                                </Badge>
                                                            ) : (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-primary/30 p-4 text-primary transition-all hover:bg-primary/10 hover:text-primary-foreground"
                                                                    onClick={() => importProject(project)}
                                                                    disabled={importingProject === project.key}
                                                                >
                                                                    {importingProject === project.key ? (
                                                                        <>
                                                                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                                                            Importing...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <ExternalLink className="mr-1 h-4 w-4" />
                                                                            Import
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Separator className="my-3" />
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">Project Key: {project.key}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="mb-6 rounded-full bg-muted p-4">
                                            <Shield className="h-12 w-12 text-muted-foreground opacity-80" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-medium">
                                            {searchTerm ? 'No projects match your search' : 'No projects available to import'}
                                        </h3>
                                        <p className="max-w-md text-center text-sm text-muted-foreground">
                                            {searchTerm
                                                ? 'Try a different search term or clear your search to see all projects.'
                                                : 'All your Jira projects may already be imported or no projects were found.'}
                                        </p>
                                        {searchTerm && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSearchTerm('')}
                                                className="mt-4 border-primary/30 text-primary hover:bg-primary/10"
                                            >
                                                Clear Search
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MasterLayout>
    )
}
