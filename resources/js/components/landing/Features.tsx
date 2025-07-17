import { type SharedData } from '@/types'
import { usePage } from '@inertiajs/react'
import { BarChart2, Briefcase, Clock, Github, Upload, Users } from 'lucide-react'

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
                    <article className="animate-fade-up animate-once animate-delay-500 group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Clock className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Time Tracking</h3>
                        <p className="text-muted-foreground">
                            Track time with a single click. Add notes and categorize your activities for better insights. Set timers, track breaks,
                            and monitor overtime automatically.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-700 group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <BarChart2 className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Detailed Reports</h3>
                        <p className="text-muted-foreground">
                            Generate comprehensive reports to analyze your productivity and identify improvement areas. Export data in multiple
                            formats for seamless integration with other tools.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-900 group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Users className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Team Collaboration</h3>
                        <p className="text-muted-foreground">
                            Manage your team's time, assign projects, and track progress all in one place. Real-time updates and notifications keep
                            everyone in sync.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-[1100ms] group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Briefcase className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Client Management</h3>
                        <p className="text-muted-foreground">
                            Organize and manage your clients effortlessly. Track client projects, store contact information, and maintain detailed
                            records for better client relationships and billing accuracy.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-[1300ms] group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Bulk Upload</h3>
                        <p className="text-muted-foreground">
                            Save time by importing multiple time logs at once. Download a template, fill it with your data, and upload it to quickly
                            record all your work hours in one go.
                        </p>
                    </article>

                    <article className="animate-fade-up animate-once animate-delay-[1500ms] group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-card to-card/95 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 opacity-70 blur-2xl transition-all duration-300 group-hover:bg-primary/10 group-hover:opacity-100"></div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                            <Github className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">GitHub Integration</h3>
                        <p className="text-muted-foreground">
                            Connect your GitHub account to import repositories as projects. Track time spent on specific repositories and
                            streamline your development workflow.
                        </p>
                    </article>
                </div>
            </section>

            {/* Highlighted Integration Section */}
            <section id="integration" className="container mx-auto mb-24 px-6 lg:px-8" aria-label="GitHub integration">
                <div className="animate-fade-up animate-once relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-8 shadow-lg">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 opacity-70 blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 opacity-70 blur-3xl"></div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-12 relative z-10">
                        <div className="mb-8 md:mb-0 md:w-1/4">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/20 shadow-md transition-colors">
                                <Github className="h-12 w-12 text-primary" aria-label="GitHub logo" />
                            </div>
                        </div>
                        <div className="md:w-3/4">
                            <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">GitHub Integration</h2>
                            <p className="text-lg text-muted-foreground">
                                Connect your GitHub account to import repositories as projects. Track time spent on specific repositories and
                                streamline your development workflow. Our seamless GitHub integration allows you to automatically sync your
                                repositories and measure productivity across your development projects.
                            </p>
                            <div className="mt-8">
                                <a
                                    href="/integration"
                                    className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10"
                                    aria-label={isLoggedIn ? 'Connect your account with GitHub' : 'Get started with Work Hours'}
                                >
                                    {isLoggedIn ? 'Connect with GitHub' : 'Get Started'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
