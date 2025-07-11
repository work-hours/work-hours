import { BarChart2, Clock, Users } from 'lucide-react'

export default function Features() {
    return (
        <section id="features" className="container mx-auto mb-24 px-6 lg:px-8">
            <div className="mb-16 text-center">
                <h2 className="animate-fade-up animate-once mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Powerful Features</h2>
                <p className="animate-fade-up animate-once animate-delay-300 mx-auto max-w-2xl text-lg text-muted-foreground">
                    Everything you need to track, analyze, and optimize your work hours.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="animate-fade-up animate-once animate-delay-500 group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Clock className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Time Tracking</h3>
                    <p className="text-muted-foreground">
                        Track time with a single click. Add notes and categorize your activities for better insights. Set timers, track breaks, and
                        monitor overtime automatically.
                    </p>
                </div>

                <div className="animate-fade-up animate-once animate-delay-700 group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <BarChart2 className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Detailed Reports</h3>
                    <p className="text-muted-foreground">
                        Generate comprehensive reports to analyze your productivity and identify improvement areas. Export data in multiple formats
                        for seamless integration with other tools.
                    </p>
                </div>

                <div className="animate-fade-up animate-once animate-delay-900 group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Users className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Team Collaboration</h3>
                    <p className="text-muted-foreground">
                        Manage your team's time, assign project, and track progress all in one place. Real-time updates and notifications keep
                        everyone in sync.
                    </p>
                </div>
            </div>
        </section>
    )
}
