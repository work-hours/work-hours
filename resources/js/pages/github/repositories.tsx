import { Head } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Github, Search, Loader2 } from 'lucide-react'
import axios from 'axios'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'

type Repository = {
    id: string
    name: string
    full_name: string
    description: string | null
    html_url: string
    private: boolean
    organization?: string
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

export default function GitHubRepositories() {
    const [personalRepos, setPersonalRepos] = useState<Repository[]>([])
    const [orgReposByOrg, setOrgReposByOrg] = useState<Record<string, Repository[]>>({})
    const [organizations, setOrganizations] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // activeTab is used in the Tabs component to track the current tab
    const [activeTab, setActiveTab] = useState('personal')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Check if user is authenticated with GitHub
        const checkGitHubAuth = async () => {
            try {
                await axios.get(route('github.repositories.personal'))
                setIsAuthenticated(true)
                fetchRepositories()
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    setIsAuthenticated(false)
                } else {
                    // Display the specific error message from the backend if available
                    if (axios.isAxiosError(error) && error.response?.data?.error) {
                        setError(error.response.data.error)
                    } else {
                        setError('An error occurred while checking GitHub authentication.')
                    }
                }
            }
        }

        checkGitHubAuth()
    }, [])

    const fetchRepositories = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Fetch personal repositories
            const personalResponse = await axios.get(route('github.repositories.personal'))
            setPersonalRepos(personalResponse.data)

            // Fetch organization repositories
            const orgResponse = await axios.get(route('github.repositories.organization'))
            const orgReposData = orgResponse.data

            // Group organization repositories by organization
            const reposByOrg: Record<string, Repository[]> = {}
            const orgs: string[] = []

            orgReposData.forEach((repo: Repository) => {
                if (repo.organization) {
                    if (!reposByOrg[repo.organization]) {
                        reposByOrg[repo.organization] = []
                        orgs.push(repo.organization)
                    }
                    reposByOrg[repo.organization].push(repo)
                }
            })

            setOrgReposByOrg(reposByOrg)
            setOrganizations(orgs)
        } catch (error) {
            // Display the specific error message from the backend if available
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                setError(error.response.data.error)
            } else {
                setError('Failed to fetch repositories. Please try again.')
            }
            console.error('Error fetching repositories:', error)
        } finally {
            setIsLoading(false)
        }
    }


    const renderRepositoryList = (repositories: Repository[]) => {
        const filteredRepos = repositories.filter(repo =>
            repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )

        if (isLoading) {
            return (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )
        }

        if (filteredRepos.length === 0) {
            return (
                <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No repositories match your search' : 'No repositories found'}
                </div>
            )
        }

        return (
            <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-3">
                    {filteredRepos.map(repo => (
                        <div key={repo.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50">
                            <div className="flex-1">
                                <div className="font-medium">
                                    {repo.name}
                                    {repo.private && <Badge variant="outline" className="ml-2 text-xs">Private</Badge>}
                                </div>
                                {repo.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                                )}
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                                >
                                    {repo.full_name}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        )
    }

    if (!isAuthenticated) {
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
                            Connect and manage GitHub repositories
                        </p>
                    </section>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Github className="h-5 w-5" />
                                GitHub Repositories
                            </CardTitle>
                            <CardDescription>Connect your GitHub account to view your repositories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-6">
                                <Github className="h-12 w-12 mb-4 text-muted-foreground" />
                                <p className="text-center mb-4">You need to authenticate with GitHub to access your repositories.</p>
                                <a href={route('auth.github')} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                    <Github className="mr-2 h-4 w-4" />
                                    Connect GitHub Account
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
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
                        View and manage your GitHub repositories
                    </p>
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Github className="h-5 w-5" />
                            GitHub Repositories
                        </CardTitle>
                        <CardDescription>Browse your personal and organization repositories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/15 text-destructive rounded-md p-3 mb-4">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search repositories..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <Tabs defaultValue="personal" onValueChange={setActiveTab}>
                            <TabsList className="mb-4 flex flex-wrap">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                {organizations.map(org => (
                                    <TabsTrigger key={org} value={org}>{org}</TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value="personal">
                                {renderRepositoryList(personalRepos)}
                            </TabsContent>

                            {/* Dynamic tabs for each organization */}
                            {organizations.map(org => (
                                <TabsContent key={org} value={org}>
                                    {renderRepositoryList(orgReposByOrg[org] || [])}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
