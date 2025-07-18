import { Clock, FolderPlus, UserPlus, Users, Zap } from 'lucide-react'

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative container mx-auto mb-24 px-6 lg:px-8" aria-label="How to use Work Hours">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 -left-4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true"></div>
                <div className="absolute -right-4 bottom-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true"></div>
            </div>

            <div className="mb-16 text-center">
                <h2 className="animate-fade-up animate-once mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">How It Works</h2>
                <p className="animate-fade-up animate-once animate-delay-300 mx-auto max-w-2xl text-lg text-muted-foreground">
                    Get started with Work Hours in four simple steps
                </p>
            </div>

            {/* Process steps with connecting lines */}
            <div className="relative">
                {/* Connecting line for desktop */}
                <div
                    className="absolute top-24 left-1/2 hidden h-[calc(100%-120px)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/10 lg:block"
                    aria-hidden="true"
                ></div>

                {/* Connecting lines for tablet */}
                <div
                    className="absolute top-24 left-1/2 hidden h-[calc(100%-120px)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/10 md:block lg:hidden"
                    aria-hidden="true"
                ></div>

                <ol className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <li className="animate-fade-up animate-once animate-delay-500 group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30"
                            aria-hidden="true"
                        >
                            <div className="flex items-center justify-center">
                                <span className="absolute text-xl font-bold opacity-20">1</span>
                                <UserPlus className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Create Your Account</h3>
                        <p className="text-muted-foreground">
                            Sign up for free in less than a minute. No credit card required to get started with our basic plan.
                        </p>
                    </li>

                    <li className="animate-fade-up animate-once animate-delay-700 group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30"
                            aria-hidden="true"
                        >
                            <div className="flex items-center justify-center">
                                <span className="absolute text-xl font-bold opacity-20">2</span>
                                <FolderPlus className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Set Up Your Projects</h3>
                        <p className="text-muted-foreground">
                            Create or import projects and customize your workspace to match your workflow and business needs.
                        </p>
                    </li>

                    <li className="animate-fade-up animate-once animate-delay-900 group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30"
                            aria-hidden="true"
                        >
                            <div className="flex items-center justify-center">
                                <span className="absolute text-xl font-bold opacity-20">3</span>
                                <Users className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Build Your Team</h3>
                        <p className="text-muted-foreground">
                            Invite team members, assign them to projects, and set hourly rates for accurate time tracking.
                        </p>
                    </li>

                    <li className="animate-fade-up animate-once animate-delay-[1100ms] group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30"
                            aria-hidden="true"
                        >
                            <div className="flex items-center justify-center">
                                <span className="absolute text-xl font-bold opacity-20">4</span>
                                <Clock className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Start Tracking Time</h3>
                        <p className="text-muted-foreground">
                            Track time with a single click, generate reports, and optimize your productivity with data-driven insights.
                        </p>
                    </li>
                </ol>
            </div>

            <div className="mt-16 flex justify-center">
                <div
                    className="animate-fade-up animate-once animate-delay-[1300ms] flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 px-6 py-3 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                    role="note"
                >
                    <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium">Most users are up and running in less than 10 minutes!</span>
                </div>
            </div>
        </section>
    )
}
