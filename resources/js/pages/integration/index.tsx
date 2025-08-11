import { Head, Link } from '@inertiajs/react'
import { Github, Trello } from 'lucide-react' // Added Trello icon for Jira

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

type Props = {
    isGitHubIntegrated: boolean
    isJiraIntegrated: boolean // Added Jira integration status
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integration',
        href: '/integration',
    },
]

export default function Integration({ isGitHubIntegrated, isJiraIntegrated }: Props) {
    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Integration" />
            <div className="mx-auto flex w-full flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Integration</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your integrations with external services</p>
                </section>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Github className="h-6 w-6" />
                            GitHub Integration
                        </CardTitle>
                        <CardDescription>Connect your GitHub account to access and manage repositories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGitHubIntegrated ? (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-green-600 dark:text-green-400">Your account is integrated with GitHub.</p>
                                <Button asChild variant="outline">
                                    <Link href="/github/repositories">Manage Repositories</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-muted-foreground">Connect your GitHub account to access and manage your repositories.</p>
                                <Button asChild>
                                    <a href="/auth/github">
                                        <Github className="mr-2 h-4 w-4" />
                                        Connect with GitHub
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Jira Integration Card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Trello className="h-6 w-6" />
                            Jira Integration
                        </CardTitle>
                        <CardDescription>Connect your Jira account to access and manage projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isJiraIntegrated ? (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-green-600 dark:text-green-400">Your account is integrated with Jira.</p>
                                <Button asChild variant="outline">
                                    <Link href="/jira/projects">Manage Projects</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-muted-foreground">Connect your Jira account to access and manage your projects.</p>
                                <Button asChild>
                                    <Link href="/jira/connect">
                                        <Trello className="mr-2 h-4 w-4" />
                                        Connect with Jira
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
