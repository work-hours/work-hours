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
                    {/* GitHub Integration - Moved to first position and enhanced */}
                    <article className="animate-fade-up animate-once animate-delay-500 group relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/5 to-card/95 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 opacity-80 blur-2xl transition-all duration-300 group-hover:bg-primary/20 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-18 w-18 items-center justify-center rounded-2xl bg-primary/15 transition-colors duration-300 group-hover:bg-primary/25">
                            <Github className="h-10 w-10 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground flex items-center">
                            GitHub Integration
                            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                Popular
                            </span>
                        </h3>
                        <p className="text-muted-foreground">
                            Connect your GitHub account to import repositories as projects. Track time spent on specific repositories and streamline
                            your development workflow with our powerful integration.
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

            {/* Enhanced GitHub Integration Section */}
            <section id="integration" className="container mx-auto mb-24 px-6 lg:px-8" aria-label="GitHub integration">
                <div className="animate-fade-up animate-once relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 p-10 shadow-xl">
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/10 opacity-80 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/10 opacity-80 blur-3xl"></div>

                    {/* GitHub-like decorative elements */}
                    <div className="absolute top-10 right-10 h-16 w-16 rounded-full border-4 border-dashed border-primary/20 opacity-50"></div>
                    <div className="absolute bottom-20 left-40 h-24 w-24 rounded-full border-4 border-dotted border-primary/20 opacity-50"></div>
                    <div className="absolute top-40 left-20 h-12 w-12 rounded-full border-4 border-primary/20 opacity-50"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
                            <div className="mb-10 md:mb-0 md:w-1/3 flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full transform scale-150"></div>
                                    <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
                                        <Github className="h-16 w-16 text-primary" aria-label="GitHub logo" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                                        <span>★</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                                    <span className="mr-1">★</span> Featured Integration
                                </div>
                                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                                    Seamless GitHub Integration
                                </h2>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Connect your GitHub account to import repositories as projects. Track time spent on specific repositories and
                                    streamline your development workflow. Our powerful GitHub integration allows you to:
                                </p>
                                <ul className="space-y-2 mb-8">
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Automatically sync your repositories as projects</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Track time spent on specific repositories and branches</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2 text-primary">✓</span>
                                        <span>Measure productivity across your development projects</span>
                                    </li>
                                </ul>
                                <div className="mt-8">
                                    <a
                                        href="/integration"
                                        className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                                        aria-label={isLoggedIn ? 'Connect your account with GitHub' : 'Get started with Work Hours'}
                                    >
                                        <Github className="mr-2 h-5 w-5" />
                                        {isLoggedIn ? 'Connect with GitHub' : 'Get Started with GitHub'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Multiple Currency Management Section */}
            <section id="currency-management" className="container mx-auto mb-24 px-6 lg:px-8" aria-label="Multiple currency management">
                <div className="animate-fade-up animate-once relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-10 shadow-xl">
                    {/* Decorative currency symbols */}
                    <div className="absolute top-6 right-8 text-blue-300/30 text-6xl font-bold">$</div>
                    <div className="absolute top-12 right-20 text-green-300/20 text-4xl font-bold">€</div>
                    <div className="absolute bottom-8 left-12 text-amber-300/20 text-5xl font-bold">¥</div>
                    <div className="absolute bottom-16 left-28 text-purple-300/20 text-4xl font-bold">£</div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-inner mb-4">
                                <DollarSign className="h-10 w-10 text-blue-600 dark:text-blue-400" aria-label="Currency icon" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Multiple Currency Management</h2>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-lg text-center text-muted-foreground mb-8">
                                Work with multiple currencies seamlessly across your projects and teams. Set different currencies for different clients,
                                track earnings in various currencies, and generate reports with accurate currency conversions. Our flexible currency
                                management system adapts to your global business needs, making international collaboration and billing effortless.
                            </p>

                            <div className="flex justify-center">
                                <a
                                    href={isLoggedIn ? "/settings/currency" : "/register"}
                                    className="inline-flex items-center rounded-full bg-blue-600 dark:bg-blue-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md"
                                    aria-label={isLoggedIn ? 'Manage your currencies' : 'Get started with Work Hours'}
                                >
                                    {isLoggedIn ? 'Manage Currencies' : 'Get Started'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
