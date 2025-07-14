import { Head, Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Github, Search, Loader2, ExternalLink } from 'lucide-react'
import axios from 'axios'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type NavItem } from '@/types'
import { cn } from '@/lib/utils'

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
    const [activeTab, setActiveTab] = useState('personal')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Generate sidebar navigation items
    const generateSidebarNavItems = (): NavItem[] => {
        const navItems: NavItem[] = [
            {
                title: 'Personal',
                href: '/github/repositories?tab=personal',
                icon: Github,
            }
        ]

        // Add organization tabs
        organizations.forEach(org => {
            navItems.push({
                title: org,
                href: `/github/repositories?tab=${org}`,
                icon: Github,
            })
        })

        return navItems
    }

    useEffect(() => {
        // Check if user is authenticated with GitHub
        const checkGitHubAuth = async () => {
            try {
                await axios.get(route('github.repositories.personal'))
                setIsAuthenticated(true)
                fetchRepositories()

                // Check for tab parameter in URL
                const urlParams = new URLSearchParams(window.location.search);
                const tabParam = urlParams.get('tab');
                if (tabParam) {
                    setActiveTab(tabParam);
                }
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
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Loading repositories...</p>
                </div>
            )
        }

        if (filteredRepos.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Github className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-1">
                        {searchTerm ? 'No repositories match your search' : 'No repositories found'}
                    </p>
                    <p className="text-sm">
                        {searchTerm ? 'Try a different search term' : 'Connect more repositories to get started'}
                    </p>
                </div>
            )
        }

        return (
            <ScrollArea className="h-[450px] pr-2">
                <div className="space-y-4">
                    {filteredRepos.map(repo => (
                        <div
                            key={repo.id}
                            className="flex flex-col p-4 border rounded-lg shadow-sm hover:bg-muted/30 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-medium text-lg">
                                        <Github className="h-4 w-4" />
                                        {repo.name}
                                        {repo.private && (
                                            <Badge variant="outline" className="ml-1 text-xs font-normal">
                                                Private
                                            </Badge>
                                        )}
                                    </div>
                                    {repo.description && (
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{repo.description}</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                >
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Open in GitHub"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                            <Separator className="my-3" />
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span>{repo.full_name}</span>
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

    // Get the current tab
    const currentTab = activeTab;

    // Generate sidebar navigation items
    const sidebarNavItems = generateSidebarNavItems();

    // Determine which repositories to display based on the active tab
    const getRepositoriesToDisplay = () => {
        if (currentTab === 'personal') {
            return personalRepos;
        }
        return orgReposByOrg[currentTab] || [];
    };

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

                <div className="mt-6 flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    {/* Sidebar */}
                    <aside className="w-full max-w-xl lg:w-56">
                        <Card className="overflow-hidden transition-all hover:shadow-sm">
                            <nav className="flex flex-col p-2">
                                {sidebarNavItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = item.title.toLowerCase() === currentTab.toLowerCase();

                                    return (
                                        <Button
                                            key={`${item.href}-${index}`}
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn('mb-1 w-full justify-start', {
                                                'bg-primary/10 text-primary hover:bg-primary/15': isActive,
                                                'hover:bg-muted/80': !isActive,
                                            })}
                                        >
                                            <Link href={item.href} className="flex items-center gap-2">
                                                {Icon && <Icon className="h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </nav>
                        </Card>
                    </aside>

                    <Separator className="my-6 md:hidden" />

                    {/* Main content */}
                    <div className="flex-1 md:max-w-2xl">
                        <Card className="overflow-hidden transition-all hover:shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Github className="h-5 w-5" />
                                    {currentTab === 'personal' ? 'Personal Repositories' : `${currentTab} Repositories`}
                                </CardTitle>
                                <CardDescription>
                                    {currentTab === 'personal'
                                        ? 'Browse your personal GitHub repositories'
                                        : `Browse repositories from the ${currentTab} organization`}
                                </CardDescription>
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

                                {renderRepositoryList(getRepositoriesToDisplay())}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
