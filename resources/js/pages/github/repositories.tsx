import { Head } from '@inertiajs/react'
import axios from 'axios'
import { Download, ExternalLink, Github, Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import MasterLayout from '@/layouts/master-layout'
import { cn } from '@/lib/utils'
import { type BreadcrumbItem, type NavItem } from '@/types'
import { toast } from 'sonner'

type Repository = {
    id: string
    name: string
    full_name: string
    description: string | null
    html_url: string
    private: boolean
    organization?: string
    is_imported?: boolean
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
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [importingRepo, setImportingRepo] = useState<string | null>(null)

    const handleImportRepository = async (repo: Repository) => {
        try {
            setImportingRepo(repo.id)
            const response = await axios.post(route('github.repositories.import'), {
                repo_id: repo.id,
                name: repo.name,
                description: repo.description || `Imported from GitHub: ${repo.full_name}`,
                full_name: repo.full_name,
                html_url: repo.html_url,
            })

            if (response.data.success === false) {
                if (response.data.error) {
                    toast.error(response.data.error)
                } else {
                    toast.error('Failed to import repository. Please try again.')
                }
            } else {
                toast.success('Repository successfully imported as a project!')
                repo.is_imported = true
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                toast.error(error.response.data.error)
            } else {
                toast.error('Failed to import repository. Please try again.')
            }
        } finally {
            setImportingRepo(null)
        }
    }

    const generateSidebarNavItems = (): NavItem[] => {
        const navItems: NavItem[] = [
            {
                title: 'Personal',
                href: '/github/repositories?tab=personal',
                icon: Github,
            },
        ]

        organizations.forEach((org) => {
            navItems.push({
                title: org,
                href: `/github/repositories?tab=${org}`,
                icon: Github,
            })
        })

        return navItems
    }

    useEffect(() => {
        const checkGitHubAuth = async () => {
            setIsCheckingAuth(true)
            try {
                await axios.get(route('github.repositories.personal'))
                setIsAuthenticated(true)
                fetchRepositories().then()

                const urlParams = new URLSearchParams(window.location.search)
                const tabParam = urlParams.get('tab')
                if (tabParam) {
                    setActiveTab(tabParam)
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    setIsAuthenticated(false)
                } else {
                    if (axios.isAxiosError(error) && error.response?.data?.error) {
                        setError(error.response.data.error)
                    } else {
                        setError('An error occurred while checking GitHub authentication.')
                    }
                }
            } finally {
                setIsCheckingAuth(false)
            }
        }

        checkGitHubAuth().then()
    }, [])

    const fetchRepositories = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const personalResponse = await axios.get(route('github.repositories.personal'))
            setPersonalRepos(personalResponse.data)

            const orgResponse = await axios.get(route('github.repositories.organization'))
            const orgReposData = orgResponse.data

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
        const filteredRepos = repositories.filter(
            (repo) =>
                repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())),
        )

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-6 rounded-full bg-primary/10 p-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-100">Loading Repositories</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fetching repositories from GitHub...</p>
                </div>
            )
        }

        if (filteredRepos.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-6 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                        <Github className="h-12 w-12 text-gray-600 dark:text-gray-300" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-100">
                        {searchTerm ? 'No repositories match your search' : 'No repositories found'}
                    </h3>
                    <p className="max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm
                            ? 'Try a different search term or clear your search to see all repositories.'
                            : 'No repositories were found for this account. If you expect to see repositories, ensure you have granted the necessary permissions.'}
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
            )
        }

        return (
            <ScrollArea className="h-[450px] pr-2">
                <div className="space-y-4">
                    {filteredRepos.map((repo) => (
                        <Card
                            key={repo.id}
                            className="overflow-hidden border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-100">
                                            <Github className="h-4 w-4 text-primary" />
                                            {repo.name}
                                            {repo.private && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-1 border-amber-200 bg-amber-100 text-xs font-normal text-amber-700 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                                >
                                                    Private
                                                </Badge>
                                            )}
                                        </div>
                                        {repo.description && (
                                            <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{repo.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!repo.is_imported ? (
                                            <Button
                                                size="sm"
                                                className="bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                onClick={() => handleImportRepository(repo)}
                                                disabled={importingRepo === repo.id}
                                            >
                                                {importingRepo === repo.id ? (
                                                    <>
                                                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                                        Importing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="mr-1 h-4 w-4" />
                                                        Import
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="mr-2 border-green-300/50 bg-transparent p-2 text-green-700 dark:text-green-300"
                                            >
                                                Imported
                                            </Badge>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                        >
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" title="Open in GitHub">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                                <Separator className="my-3" />
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">{repo.full_name}</span>
                                    {repo.organization && (
                                        <Badge variant="outline" className="text-xs font-normal">
                                            {repo.organization}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        )
    }

    if (isCheckingAuth) {
        return (
            <MasterLayout breadcrumbs={breadcrumbs}>
                <Head title="GitHub Repositories" />
                <div className="mx-auto flex flex-col gap-4 p-4">
                    <section className="mb-2">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">GitHub Repositories</h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Loading GitHub repositories</p>
                            </div>
                        </div>
                    </section>

                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="mb-6 rounded-full bg-primary/10 p-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                </div>
                                <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-gray-100">Checking GitHub Connection</h3>
                                <p className="text-gray-500 dark:text-gray-400">Please wait while we verify your GitHub authentication status...</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MasterLayout>
        )
    }

    if (!isAuthenticated) {
        return (
            <MasterLayout breadcrumbs={breadcrumbs}>
                <Head title="GitHub Repositories" />
                <div className="mx-auto flex flex-col gap-4 p-4 md:w-10/12">
                    <section className="mb-2">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">GitHub Repositories</h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Connect and manage GitHub repositories</p>
                            </div>
                        </div>
                    </section>

                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                    <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">GitHub Integration</CardTitle>
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Connect your GitHub account to view your repositories
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="mb-6 rounded-full bg-primary/10 p-4">
                                    <Github className="h-16 w-16 text-primary" />
                                </div>
                                <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-gray-100">Connect with GitHub</h3>
                                <p className="mb-6 max-w-md text-center text-gray-500 dark:text-gray-400">
                                    Link your GitHub account to access and manage your repositories directly from this application.
                                </p>
                                <Button asChild className="bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    <a href={route('auth.github')}>
                                        <Github className="mr-2 h-4 w-4" />
                                        Connect GitHub Account
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MasterLayout>
        )
    }

    const currentTab = activeTab
    const sidebarNavItems = generateSidebarNavItems()
    const getRepositoriesToDisplay = () => {
        if (currentTab === 'personal') {
            return personalRepos
        }
        return orgReposByOrg[currentTab] || []
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="GitHub Repositories" />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                            <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">GitHub Repositories</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage your GitHub repositories</p>
                        </div>
                    </div>
                </section>

                <div className="mt-6 flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-64">
                        <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                            <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Repository Sources</h3>
                            </div>
                            <nav className="flex flex-col p-2">
                                {sidebarNavItems.map((item, index) => {
                                    const Icon = item.icon
                                    const isActive = item.title.toLowerCase() === currentTab.toLowerCase()

                                    return (
                                        <Button
                                            key={`${item.href}-${index}`}
                                            size="sm"
                                            variant="ghost"
                                            className={cn('mb-1 w-full justify-start px-3 py-2 text-sm text-gray-800', {
                                                'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600': isActive,
                                                'hover:bg-gray-100 dark:hover:bg-gray-800': !isActive,
                                            })}
                                            onClick={() => {
                                                setActiveTab(item.title.toLowerCase())

                                                const url = new URL(window.location.href)
                                                url.searchParams.set('tab', item.title.toLowerCase())
                                                window.history.pushState({}, '', url)
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {Icon && <Icon className="h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </div>
                                        </Button>
                                    )
                                })}
                            </nav>
                        </Card>
                    </aside>

                    <Separator className="my-6 md:hidden" />

                    <div className="flex-1 md:max-w-3xl">
                        <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                            <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                        <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                            {currentTab === 'personal' ? 'Personal Repositories' : `${currentTab} Repositories`}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                            {currentTab === 'personal'
                                                ? 'Browse your personal GitHub repositories'
                                                : `Browse repositories from the ${currentTab} organization`}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                {error && <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive">{error}</div>}

                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <Input
                                            type="search"
                                            placeholder="Search repositories..."
                                            className="h-10 border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary/70 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
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
        </MasterLayout>
    )
}
