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
                <div className="mx-auto flex flex-col gap-4 p-4 md:w-10/12">
                    <section className="mb-2">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Jira Projects</h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Connect and manage your Jira projects</p>
                            </div>
                        </div>
                    </section>

                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                    <Shield className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Jira Integration</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Connect your Jira account to access your projects
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="mb-6 rounded-full bg-yellow-100 p-4 dark:bg-yellow-900/50">
                                    <Shield className="h-10 w-10 text-yellow-600 dark:text-yellow-200" />
                                </div>
                                <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-gray-100">Jira Credentials Required</h3>
                                <p className="mb-6 max-w-md text-center text-gray-500 dark:text-gray-400">
                                    You need to connect your Jira account before you can view and import projects.
                                </p>
                                <Button asChild className="bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    <Link href={route('jira.connect')}>Connect to Jira</Link>
                                </Button>
                            </div>
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
            <div className="mx-auto flex flex-col gap-4 p-4 md:w-10/12">
                <section className="mb-2">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                            <Shield className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Jira Projects</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Browse and import your Jira projects</p>
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        asChild
                        className="border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                        <Link href={route('jira.connect')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Change Credentials
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col space-y-6">
                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                    <Shield className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Import Jira Projects</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Browse and select Jira projects to import into the system
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <Input
                                        type="search"
                                        placeholder="Search projects..."
                                        className="h-10 border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary/70 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
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
                                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-100">Loading Projects</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Fetching projects from Jira...</p>
                                </div>
                            ) : filteredProjects.length > 0 ? (
                                <ScrollArea className="h-[450px] pr-2">
                                    <div className="space-y-4">
                                        {filteredProjects.map((project) => (
                                            <Card
                                                key={project.id}
                                                className="overflow-hidden border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-100">
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
                                                                <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                                                    {project.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {isProjectImported(project.key) ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="mr-2 border-green-300/50 bg-transparent p-2 text-green-700 dark:text-green-300"
                                                                >
                                                                    Imported
                                                                </Badge>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
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
                                                        <span className="text-gray-500 dark:text-gray-400">Project Key: {project.key}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="mb-6 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                                        <Shield className="h-12 w-12 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-100">
                                        {searchTerm ? 'No projects match your search' : 'No projects available to import'}
                                    </h3>
                                    <p className="max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm
                                            ? 'Try a different search term or clear your search to see all projects.'
                                            : 'All your Jira projects may already be imported or no projects were found.'}
                                    </p>
                                    {searchTerm && (
                                        <Button
                                            onClick={() => setSearchTerm('')}
                                            className="mt-4 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
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
        </MasterLayout>
    )
}
