import { Head } from '@inertiajs/react'
import axios from 'axios'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integration',
        href: '/integration',
    },
    {
        title: 'Jira Connection',
        href: '/jira/connect',
    },
]

export default function JiraConnect() {
    const [domain, setDomain] = useState('')
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const showMessage = (message: string, isError = false) => {
        if (isError) {
            setErrorMessage(message)
            setSuccessMessage(null)
        } else {
            setSuccessMessage(message)
            setErrorMessage(null)
        }

        setTimeout(() => {
            if (isError) {
                setErrorMessage(null)
            } else {
                setSuccessMessage(null)
            }
        }, 5000)
    }

    const handleConnect = async () => {
        if (!domain || !email || !token) {
            showMessage('Please provide your Jira domain, email, and API token.', true)
            return
        }

        setIsLoading(true)

        try {
            await axios.post('/jira/credentials', {
                domain,
                email,
                token,
            })

            showMessage('Your Jira credentials have been validated and saved.')

            window.location.href = '/jira/projects'
        } catch (error: any) {
            console.error('Error connecting to Jira:', error)
            showMessage(error.response?.data?.message || 'Could not connect to Jira. Please check your credentials.', true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Connect to Jira" />
            <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Connect to Jira</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Enter your Jira credentials to access your projects</p>
                </section>

                {/* Messages */}
                {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/50 dark:text-green-200">{successMessage}</div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Jira Credentials</CardTitle>
                        <CardDescription>Enter your Jira credentials to connect to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleConnect()
                            }}
                        >
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="domain">Jira Domain</Label>
                                <div className="flex items-center">
                                    <Input id="domain" placeholder="mycompany" value={domain} onChange={(e) => setDomain(e.target.value)} />
                                    <span className="ml-2 text-muted-foreground">.atlassian.net</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Enter only the subdomain part</p>
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="token">API Token</Label>
                                <Input
                                    id="token"
                                    type="password"
                                    placeholder="Your Jira API token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>
                                        Generate an API token in your{' '}
                                        <a
                                            href="https://id.atlassian.com/manage-profile/security/api-tokens"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-primary"
                                        >
                                            Atlassian account settings
                                        </a>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Connect to Jira
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
