import { Zap } from 'lucide-react'

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="container mx-auto mb-24 px-6 lg:px-8">
            <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">How It Works</h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Get started with Work Hours in three simple steps</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                        <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Create Your Account</h3>
                    <p className="text-muted-foreground">
                        Sign up for free in less than a minute. No credit card required to get started with our basic plan.
                    </p>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                        <span className="text-xl font-bold">2</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Set Up Your Projects</h3>
                    <p className="text-muted-foreground">
                        Create projects, invite team members, and customize your workspace to match your workflow.
                    </p>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                        <span className="text-xl font-bold">3</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Start Tracking Time</h3>
                    <p className="text-muted-foreground">
                        Track time with a single click, generate reports, and optimize your productivity with data-driven insights.
                    </p>
                </div>
            </div>

            <div className="mt-16 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Most users are up and running in less than 10 minutes!</span>
                </div>
            </div>
        </section>
    )
}
