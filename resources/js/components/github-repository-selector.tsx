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
    // orgRepos is kept for backward compatibility with existing code
    // but we now primarily use orgReposByOrg for organization repositories
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            setOrgRepos(orgReposData)

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

            // No need to fetch saved repositories anymore
            setOrgReposByOrg(reposByOrg)
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

    const handleRepositoryToggle = (repo: Repository) => {
        // Update the selected state in the appropriate list
        if (activeTab === 'personal') {
            setPersonalRepos((prev) => prev.map((r) => (r.id === repo.id ? { ...r, selected: !r.selected } : r)))
        } else if (repo.organization) {
            // Update in the organization-specific list
            setOrgReposByOrg((prev) => {
                const org = repo.organization as string
                return {
                    ...prev,
                    [org]: prev[org].map((r) => (r.id === repo.id ? { ...r, selected: !r.selected } : r)),
                }
            })

            // Also update in the combined list for backward compatibility
            setOrgRepos((prev) => prev.map((r) => (r.id === repo.id ? { ...r, selected: !r.selected } : r)))
        }

        // Update the selectedRepos list
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
            // The repositories are no longer saved to the database
            // Just call the callback to indicate that repositories were "saved"
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Github className="h-5 w-5" />
                        GitHub Repositories
                    </CardTitle>
                    <CardDescription>Connect your GitHub account to add repositories to this project</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6">
                        <Github className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="mb-4 text-center">You need to authenticate with GitHub to access your repositories.</p>
                        <Button asChild>
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Github className="h-5 w-5" />
                    GitHub Repositories
                </CardTitle>
                <CardDescription>Select repositories to add to this project</CardDescription>
            </CardHeader>
            <CardContent>
                {error && <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive">{error}</div>}

                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search repositories..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {selectedRepos.length > 0 && (
                    <div className="mb-4">
                        <h3 className="mb-2 text-sm font-medium">Selected Repositories ({selectedRepos.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedRepos.map((repo) => (
                                <Badge key={repo.id} variant="secondary" className="flex items-center gap-1">
                                    {repo.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRepositoryToggle(repo)}
                                        className="ml-1 rounded-full p-0.5 hover:bg-muted"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <Tabs defaultValue="personal" onValueChange={setActiveTab}>
                    <TabsList className="mb-4 flex flex-wrap">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        {organizations.map((org) => (
                            <TabsTrigger key={org} value={org}>
                                {org}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="personal">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredPersonalRepos.length > 0 ? (
                            <ScrollArea className="h-[400px] pr-2">
                                <div className="space-y-3">
                                    {filteredPersonalRepos.map((repo) => (
                                        <div key={repo.id} className="flex items-start space-x-3 rounded-md border p-3 hover:bg-muted/50">
                                            <Checkbox
                                                id={`repo-${repo.id}`}
                                                checked={repo.selected || false}
                                                onCheckedChange={() => handleRepositoryToggle(repo)}
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor={`repo-${repo.id}`} className="cursor-pointer font-medium">
                                                    {repo.name}
                                                    {repo.private && (
                                                        <Badge variant="outline" className="ml-2 text-xs">
                                                            Private
                                                        </Badge>
                                                    )}
                                                </Label>
                                                {repo.description && <p className="mt-1 text-sm text-muted-foreground">{repo.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
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
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : filteredOrgRepos.length > 0 ? (
                                    <ScrollArea className="h-[400px] pr-2">
                                        <div className="space-y-3">
                                            {filteredOrgRepos.map((repo) => (
                                                <div key={repo.id} className="flex items-start space-x-3 rounded-md border p-3 hover:bg-muted/50">
                                                    <Checkbox
                                                        id={`repo-${repo.id}`}
                                                        checked={repo.selected || false}
                                                        onCheckedChange={() => handleRepositoryToggle(repo)}
                                                    />
                                                    <div className="flex-1">
                                                        <Label htmlFor={`repo-${repo.id}`} className="cursor-pointer font-medium">
                                                            {repo.name}
                                                            {repo.private && (
                                                                <Badge variant="outline" className="ml-2 text-xs">
                                                                    Private
                                                                </Badge>
                                                            )}
                                                        </Label>
                                                        {repo.description && <p className="mt-1 text-sm text-muted-foreground">{repo.description}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        {searchTerm ? 'No repositories match your search' : `No repositories found for ${org}`}
                                    </div>
                                )}
                            </TabsContent>
                        )
                    })}
                </Tabs>

                <div className="mt-4 flex justify-end">
                    <Button onClick={saveRepositories} disabled={isSaving || selectedRepos.length === 0} className="flex items-center gap-2">
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
