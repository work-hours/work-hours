import { type SharedData } from '@/types'
import { usePage } from '@inertiajs/react'
import { BarChart2, Briefcase, Clock, DollarSign, Github, Upload, Users } from 'lucide-react'

export default function Features() {
    const { auth } = usePage<SharedData>().props
    const isLoggedIn = auth && auth.user
    return (
        <>
            <section id="features" className="container mx-auto mb-24 px-6 lg:px-8" aria-label="Product features">
                <div className="mb-16 text-center">
                    <span className="animate-fade-up animate-once inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        Features
                    </span>
                    <h2 className="animate-fade-up animate-once mt-4 mb-6 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                        Powerful Features
                    </h2>
                    <p className="animate-fade-up animate-once animate-delay-300 mx-auto max-w-2xl text-lg text-muted-foreground">
                        Everything you need to track, analyze, and optimize your work hours.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* GitHub Integration - Compact but prominent */}
                    <article className="animate-fade-up animate-once animate-delay-500 group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/5 to-card/95 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                        <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-primary/10 opacity-70 blur-xl transition-all duration-300 group-hover:opacity-100"></div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 transition-colors duration-300 group-hover:bg-primary/20">
                            <Github className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-foreground flex items-center">
                            GitHub Integration
                            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                                Popular
                            </span>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Connect GitHub to import repositories as projects and track development time efficiently.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-700 group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Clock className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Time Tracking</h3>
                        <p className="text-muted-foreground">
                            Track time with a single click. Add notes and categorize your activities for better insights. Set timers, track breaks,
                            and monitor overtime automatically.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-900 group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <BarChart2 className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Detailed Reports</h3>
                        <p className="text-muted-foreground">
                            Generate comprehensive reports to analyze your productivity and identify improvement areas. Export data in multiple
                            formats for seamless integration with other tools.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-[1100ms] group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Users className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Team Collaboration</h3>
                        <p className="text-muted-foreground">
                            Manage your team's time, assign projects, and track progress all in one place. Real-time updates and notifications keep
                            everyone in sync.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-[1300ms] group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Briefcase className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Client Management</h3>
                        <p className="text-muted-foreground">
                            Organize and manage your clients effortlessly. Track client projects, store contact information, and maintain detailed
                            records for better client relationships and billing accuracy.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-[1500ms] group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Bulk Upload</h3>
                        <p className="text-muted-foreground">
                            Save time by importing multiple time logs at once. Download a template, fill it with your data, and upload it to quickly
                            record all your work hours in one go.
                        </p>
                    </article>
                </div>
            </section>

            {/* Compact GitHub Integration Section */}
            <section id="integration" className="container mx-auto mb-16 px-6 lg:px-8" aria-label="GitHub integration">
                <div className="animate-fade-up animate-once relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 to-transparent p-6 shadow-md">
                    {/* Minimal decorative elements */}
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/5 opacity-50 blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-8">
                            <div className="mb-6 md:mb-0 md:w-1/4 flex justify-center">
                                <div className="relative">
                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-md">
                                        <Github className="h-8 w-8 text-primary" aria-label="GitHub logo" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                                        <span>★</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-3/4">
                                <div className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-2">
                                    <span className="mr-1">★</span> Featured
                                </div>
                                <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                                    GitHub Integration
                                </h2>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Connect GitHub to import repositories as projects and track development time efficiently.
                                </p>
                                <div className="flex flex-wrap gap-3 mb-4 text-xs">
                                    <span className="inline-flex items-center rounded-full bg-primary/5 px-2 py-1">
                                        <span className="mr-1 text-primary">✓</span> Repository sync
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-primary/5 px-2 py-1">
                                        <span className="mr-1 text-primary">✓</span> Repository Import
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-primary/5 px-2 py-1">
                                        <span className="mr-1 text-primary">✓</span> Productivity metrics
                                    </span>
                                </div>
                                <div>
                                    <a
                                        href="/integration"
                                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90"
                                        aria-label={isLoggedIn ? 'Connect your account with GitHub' : 'Get started with Work Hours'}
                                    >
                                        <Github className="mr-1.5 h-4 w-4" />
                                        {isLoggedIn ? 'Connect with GitHub' : 'Get Started'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compact Currency Management Section */}
            <section id="currency-management" className="container mx-auto mb-16 px-6 lg:px-8" aria-label="Multiple currency management">
                <div className="animate-fade-up animate-once relative overflow-hidden rounded-xl bg-gradient-to-b from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 p-6 shadow-md">
                    {/* Minimal decorative currency symbols */}
                    <div className="absolute top-4 right-6 text-blue-300/20 text-4xl font-bold">$</div>
                    <div className="absolute bottom-4 left-6 text-green-300/10 text-3xl font-bold">€</div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:gap-8">
                        <div className="mb-6 md:mb-0 md:w-1/4 flex justify-center">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100/70 dark:bg-blue-900/30 shadow-sm">
                                <DollarSign className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-label="Currency icon" />
                            </div>
                        </div>
                        <div className="md:w-3/4">
                            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Multiple Currency Management</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Work with multiple currencies across projects and clients. Track earnings in various currencies and generate reports with accurate conversions.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-4 text-xs">
                                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1">
                                    <span className="mr-1 text-blue-600 dark:text-blue-400">✓</span> Multi-currency billing
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1">
                                    <span className="mr-1 text-blue-600 dark:text-blue-400">✓</span> Currency conversion
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1">
                                    <span className="mr-1 text-blue-600 dark:text-blue-400">✓</span> Global reporting
                                </span>
                            </div>
                            <a
                                href={isLoggedIn ? "/settings/currency" : "/register"}
                                className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
                                aria-label={isLoggedIn ? 'Manage your currencies' : 'Get started with Work Hours'}
                            >
                                {isLoggedIn ? 'Manage Currencies' : 'Get Started'}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
