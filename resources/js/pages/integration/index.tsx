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
            <div className="mx-auto flex flex-col gap-4 p-4">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Integration</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your integrations with external services</p>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="flex items-center gap-2 text-xl text-gray-800 dark:text-gray-100">
                            <Github className="h-6 w-6" />
                            GitHub Integration
                        </CardTitle>
                        <CardDescription>Connect your GitHub account to access and manage repositories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGitHubIntegrated ? (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-green-600 dark:text-green-400">Your account is integrated with GitHub.</p>
                                <Button
                                    asChild
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    <Link href="/github/repositories">Manage Repositories</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-muted-foreground">Connect your GitHub account to access and manage your repositories.</p>
                                <Button
                                    asChild
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
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
                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="flex items-center gap-2 text-xl text-gray-800 dark:text-gray-100">
                            <Trello className="h-6 w-6" />
                            Jira Integration
                        </CardTitle>
                        <CardDescription>Connect your Jira account to access and manage projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isJiraIntegrated ? (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-green-600 dark:text-green-400">Your account is integrated with Jira.</p>
                                <Button
                                    asChild
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    <Link href="/jira/projects">Manage Projects</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-between">
                                <p className="text-muted-foreground">Connect your Jira account to access and manage your projects.</p>
                                <Button
                                    asChild
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
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
