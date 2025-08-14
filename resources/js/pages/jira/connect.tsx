import { Head } from '@inertiajs/react'
import axios from 'axios'
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
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
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                            <ShieldCheck className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Connect to Jira</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your Jira credentials to access your projects</p>
                        </div>
                    </div>
                </section>

                {/* Messages */}
                {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/50 dark:text-green-200">{successMessage}</div>
                )}

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                                <ShieldAlert className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Jira Credentials</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    Enter your Jira credentials to connect to your account
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleConnect()
                            }}
                        >
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="domain" className="text-sm font-medium">Jira Domain</Label>
                                <div className="flex items-center">
                                    <Input
                                        id="domain"
                                        placeholder="mycompany"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary/70 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
                                    />
                                    <span className="ml-2 text-gray-500 dark:text-gray-400">.atlassian.net</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Enter only the subdomain part</p>
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary/70 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
                                />
                            </div>

                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="token" className="text-sm font-medium">API Token</Label>
                                <Input
                                    id="token"
                                    type="password"
                                    placeholder="Your Jira API token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-500 focus-visible:ring-primary/70 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
                                />
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>
                                        Generate an API token in your{' '}
                                        <a
                                            href="https://id.atlassian.com/manage-profile/security/api-tokens"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-primary underline hover:text-primary/80"
                                        >
                                            Atlassian account settings
                                        </a>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-end gap-2">
                                <Button type="submit" disabled={isLoading} className="bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
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
