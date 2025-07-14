import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { Github } from 'lucide-react'

import GitHubRepositorySelector from '@/components/github-repository-selector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'

type Project = {
    id: number
    name: string
    description: string | null
}

type Props = {
    projects: Project[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'GitHub',
        href: '/github/repositories',
    },
    {
        title: 'Repositories',
        href: '/github/repositories',
    },
]

export default function GitHubRepositories({ projects }: Props) {
    const [selectedProject, setSelectedProject] = useState<number | null>(
        projects.length > 0 ? projects[0].id : null
    )

    const handleRepositoriesSaved = () => {
        // Optionally refresh the page or show a success message
        alert('Repositories saved successfully!')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="GitHub Repositories" />
            <div className="mx-auto flex w-full flex-col gap-6 p-6 md:w-10/12">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        <Github className="h-8 w-8" />
                        GitHub Repositories
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Connect and manage GitHub repositories for your projects
                    </p>
                </section>

                {projects.length > 0 ? (
                    <>
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl">Select Project</CardTitle>
                                <CardDescription>Choose a project to add GitHub repositories to</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="project" className="text-sm font-medium">
                                            Project
                                        </Label>
                                        <Select
                                            value={selectedProject?.toString() || ''}
                                            onValueChange={(value) => setSelectedProject(parseInt(value))}
                                        >
                                            <SelectTrigger id="project">
                                                <SelectValue placeholder="Select a project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projects.map((project) => (
                                                    <SelectItem key={project.id} value={project.id.toString()}>
                                                        {project.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {selectedProject && (
                            <GitHubRepositorySelector
                                projectId={selectedProject}
                                onRepositoriesSaved={handleRepositoriesSaved}
                            />
                        )}
                    </>
                ) : (
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl">No Projects Available</CardTitle>
                            <CardDescription>Create a project first to add GitHub repositories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                You need to create a project before you can add GitHub repositories. Go to the Projects
                                section to create a new project.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    )
}
