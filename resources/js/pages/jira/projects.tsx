import { useState, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import axios from 'axios'
import { Loader2, Shield, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

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
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [importingProject, setImportingProject] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [hasCredentials, setHasCredentials] = useState(true)

    // Helper function to show messages
    const showMessage = (message: string, isError = false) => {
        if (isError) {
            setErrorMessage(message)
            setSuccessMessage(null)
        } else {
            setSuccessMessage(message)
            setErrorMessage(null)
        }

        // Clear message after 5 seconds
        setTimeout(() => {
            if (isError) {
                setErrorMessage(null)
            } else {
                setSuccessMessage(null)
            }
        }, 5000)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoadingProjects(true)
        try {
            const response = await axios.get('/jira/projects/list')
            setProjects(response.data.projects)
            setHasCredentials(true)
        } catch (error: any) {
            console.error('Error fetching projects:', error)

            // Check if the error is due to missing credentials
            if (error.response?.status === 400 &&
                error.response?.data?.message?.includes('credentials')) {
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
            await axios.post('/jira/projects/import', {
                key: project.key,
                name: project.name,
                description: project.description,
            })

            showMessage(`Successfully imported ${project.name} and its issues.`)

            // Remove the imported project from the list
            setProjects((prev) => prev.filter((p) => p.key !== project.key))
        } catch (error: any) {
            console.error('Error importing project:', error)
            showMessage(error.response?.data?.message || `Failed to import ${project.name}.`, true)
        } finally {
            setImportingProject(null)
        }
    }

    if (!hasCredentials) {
        return (
            <MasterLayout breadcrumbs={breadcrumbs}>
                <Head title="Jira Projects" />
                <div className="mx-auto flex w-full flex-col gap-6 p-6">
                    <section className="mb-2">
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Jira Projects
                        </h1>
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
                                <Link href="/jira/connect">Connect to Jira</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </MasterLayout>
        )
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Jira Projects" />
            <div className="mx-auto flex w-full flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Jira Projects
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Browse and import your Jira projects</p>
                </section>

                {/* Messages */}
                {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/50 dark:text-green-200">
                        {successMessage}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Shield className="h-5 w-5" />
                        <span>Connected to Jira</span>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/jira/connect">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Change Credentials
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Import Jira Projects</CardTitle>
                        <CardDescription>Select projects to import into the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingProjects ? (
                            <div className="flex h-32 items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2">Loading projects...</span>
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold">{project.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {project.key} • {project.description || 'No description'}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => importProject(project)}
                                            disabled={importingProject === project.key}
                                        >
                                            {importingProject === project.key ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Importing...
                                                </>
                                            ) : (
                                                'Import Project'
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-32 flex-col items-center justify-center text-center">
                                <p className="text-muted-foreground">No projects available to import</p>
                                <p className="text-sm text-muted-foreground">All your Jira projects may already be imported</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
