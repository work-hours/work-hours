import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axios from 'axios'
import { Check, Github, Loader2, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Repository = {
    id: string
    name: string
    full_name: string
    description: string | null
    html_url: string
    private: boolean
    organization?: string
    selected?: boolean
}

type GitHubRepositorySelectorProps = {
    onRepositoriesSaved: () => void
}

export default function GitHubRepositorySelector({ onRepositoriesSaved }: GitHubRepositorySelectorProps) {
    const [personalRepos, setPersonalRepos] = useState<Repository[]>([])

    const [orgRepos, setOrgRepos] = useState<Repository[]>([])
    const [orgReposByOrg, setOrgReposByOrg] = useState<Record<string, Repository[]>>({})
    const [organizations, setOrganizations] = useState<string[]>([])
    const [selectedRepos, setSelectedRepos] = useState<Repository[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState('personal')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkGitHubAuth = async () => {
            try {
                await axios.get(route('github.repositories.personal'))
                setIsAuthenticated(true)
                fetchRepositories()
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
            }
        }

        checkGitHubAuth()
    }, [])

    const fetchRepositories = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const personalResponse = await axios.get(route('github.repositories.personal'))
            setPersonalRepos(personalResponse.data)

            const orgResponse = await axios.get(route('github.repositories.organization'))
            const orgReposData = orgResponse.data
            setOrgRepos(orgReposData)

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

            setOrgReposByOrg(reposByOrg)
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

    const handleRepositoryToggle = (repo: Repository) => {
        if (activeTab === 'personal') {
            setPersonalRepos((prev) => prev.map((r) => (r.id === repo.id ? { ...r, selected: !r.selected } : r)))
        } else if (repo.organization) {
            setOrgReposByOrg((prev) => {
                const org = repo.organization as string
                return {
                    ...prev,
                    [org]: prev[org].map((r) => (r.id === repo.id ? { ...r, selected: !r.selected } : r)),
                }
            })

            setOrgRepos((prev) => prev.map((r) => (r.id === repo.id ? { ...r, selected: !r.selected } : r)))
        }

        const isAlreadySelected = selectedRepos.some((r) => r.id === repo.id)

        if (isAlreadySelected) {
            setSelectedRepos((prev) => prev.filter((r) => r.id !== repo.id))
        } else {
            setSelectedRepos((prev) => [...prev, { ...repo, selected: true }])
        }
    }

    const saveRepositories = async () => {
        if (selectedRepos.length === 0) {
            setError('Please select at least one repository.')
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            onRepositoriesSaved()
        } catch (error) {
            console.error('Error handling repositories:', error)
            setError('An error occurred while processing repositories.')
        } finally {
            setIsSaving(false)
        }
    }

    const filteredPersonalRepos = personalRepos.filter(
        (repo) =>
            repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    if (!isAuthenticated) {
        return (
            <Card className="border-neutral-200 dark:border-neutral-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-neutral-100">
                        <Github className="h-5 w-5" />
                        GitHub Repositories
                    </CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">Connect your GitHub account to add repositories to this project</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6">
                        <Github className="mb-4 h-12 w-12 text-neutral-500 dark:text-neutral-400" />
                        <p className="mb-4 text-center text-neutral-600 dark:text-neutral-400">You need to authenticate with GitHub to access your repositories.</p>
                        <Button
                            asChild
                            className="bg-neutral-900 text-white transition-colors duration-200 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                        >
                            <a href={route('auth.github')}>
                                <Github className="mr-2 h-4 w-4" />
                                Connect GitHub Account
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-neutral-200 dark:border-neutral-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-neutral-100">
                    <Github className="h-5 w-5" />
                    GitHub Repositories
                </CardTitle>
                <CardDescription className="text-neutral-600 dark:text-neutral-400">Select repositories to add to this project</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-900/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        <Input
                            type="search"
                            placeholder="Search repositories..."
                            className="pl-8 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {selectedRepos.length > 0 && (
                    <div className="mb-4">
                        <h3 className="mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">Selected Repositories ({selectedRepos.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedRepos.map((repo) => (
                                <Badge
                                    key={repo.id}
                                    variant="secondary"
                                    className="flex items-center gap-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    {repo.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRepositoryToggle(repo)}
                                        className="ml-1 rounded-full p-0.5 transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <Tabs defaultValue="personal" onValueChange={setActiveTab}>
                    <TabsList className="mb-4 flex flex-wrap bg-neutral-100 dark:bg-neutral-800">
                        <TabsTrigger
                            value="personal"
                            className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-neutral-100"
                        >
                            Personal
                        </TabsTrigger>
                        {organizations.map((org) => (
                            <TabsTrigger
                                key={org}
                                value={org}
                                className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-neutral-100"
                            >
                                {org}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="personal">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-neutral-500 dark:text-neutral-400" />
                            </div>
                        ) : filteredPersonalRepos.length > 0 ? (
                            <ScrollArea className="h-[400px] pr-2">
                                <div className="space-y-3">
                                    {filteredPersonalRepos.map((repo) => (
                                        <div
                                            key={repo.id}
                                            className="flex items-start space-x-3 rounded-md border border-neutral-200 p-3 transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                                        >
                                            <Checkbox
                                                id={`repo-${repo.id}`}
                                                checked={repo.selected || false}
                                                onCheckedChange={() => handleRepositoryToggle(repo)}
                                                className="border-neutral-300 text-neutral-700 focus:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-300"
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor={`repo-${repo.id}`} className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-200">
                                                    {repo.name}
                                                    {repo.private && (
                                                        <Badge variant="outline" className="ml-2 text-xs border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                                                            Private
                                                        </Badge>
                                                    )}
                                                </Label>
                                                {repo.description && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{repo.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                                {searchTerm ? 'No repositories match your search' : 'No personal repositories found'}
                            </div>
                        )}
                    </TabsContent>

                    {/* Dynamic tabs for each organization */}
                    {organizations.map((org) => {
                        const orgRepos = orgReposByOrg[org] || []
                        const filteredOrgRepos = orgRepos.filter(
                            (repo) =>
                                repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())),
                        )

                        return (
                            <TabsContent key={org} value={org}>
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-neutral-500 dark:text-neutral-400" />
                                    </div>
                                ) : filteredOrgRepos.length > 0 ? (
                                    <ScrollArea className="h-[400px] pr-2">
                                        <div className="space-y-3">
                                            {filteredOrgRepos.map((repo) => (
                                                <div
                                                    key={repo.id}
                                                    className="flex items-start space-x-3 rounded-md border border-neutral-200 p-3 transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                                                >
                                                    <Checkbox
                                                        id={`repo-${repo.id}`}
                                                        checked={repo.selected || false}
                                                        onCheckedChange={() => handleRepositoryToggle(repo)}
                                                        className="border-neutral-300 text-neutral-700 focus:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-300"
                                                    />
                                                    <div className="flex-1">
                                                        <Label htmlFor={`repo-${repo.id}`} className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-200">
                                                            {repo.name}
                                                            {repo.private && (
                                                                <Badge variant="outline" className="ml-2 text-xs border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                                                                    Private
                                                                </Badge>
                                                            )}
                                                        </Label>
                                                        {repo.description && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{repo.description}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                                        {searchTerm ? 'No repositories match your search' : `No repositories found for ${org}`}
                                    </div>
                                )}
                            </TabsContent>
                        )
                    })}
                </Tabs>

                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={saveRepositories}
                        disabled={isSaving || selectedRepos.length === 0}
                        className="flex items-center gap-2 bg-neutral-900 text-white transition-colors duration-200 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                Save Repositories
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
