import { Head, Link } from '@inertiajs/react'
import { Github } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'

type Props = {
    isGitHubIntegrated: boolean
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integration',
        href: '/integration',
    },
]

export default function Integration({ isGitHubIntegrated }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integration" />
            <div className="mx-auto flex w-full flex-col gap-6 p-6 md:w-10/12">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Integration
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Manage your integrations with external services
                    </p>
                </section>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Github className="h-6 w-6" />
                            GitHub Integration
                        </CardTitle>
                        <CardDescription>
                            Connect your GitHub account to access and manage repositories
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGitHubIntegrated ? (
                            <div className="flex flex-col gap-4">
                                <p className="text-green-600 dark:text-green-400">
                                    Your account is integrated with GitHub.
                                </p>
                                <div className="flex gap-4">
                                    <Button asChild variant="outline">
                                        <Link href="/github/repositories">
                                            Manage Repositories
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <p className="text-muted-foreground">
                                    Connect your GitHub account to access and manage your repositories.
                                </p>
                                <div>
                                    <Button asChild>
                                        <Link href="/auth/github">
                                            <Github className="mr-2 h-4 w-4" />
                                            Connect with GitHub
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
