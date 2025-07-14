import { Zap } from 'lucide-react'

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="container mx-auto mb-24 px-6 lg:px-8" aria-label="How to use Work Hours">
            <div className="mb-16 text-center">
                <h2 className="animate-fade-up animate-once mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">How It Works</h2>
                <p className="animate-fade-up animate-once animate-delay-300 mx-auto max-w-2xl text-lg text-muted-foreground">
                    Get started with Work Hours in four simple steps
                </p>
            </div>

            <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <li className="animate-fade-up animate-once animate-delay-500 flex flex-col items-center text-center">
                    <div className="animate-bounce-slow mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white" aria-hidden="true">
                        <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Create Your Account</h3>
                    <p className="text-muted-foreground">
                        Sign up for free in less than a minute. No credit card required to get started with our basic plan.
                    </p>
                </li>

                <li className="animate-fade-up animate-once animate-delay-700 flex flex-col items-center text-center">
                    <div className="animate-bounce-slow mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white [animation-delay:200ms]" aria-hidden="true">
                        <span className="text-xl font-bold">2</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Set Up Your Projects</h3>
                    <p className="text-muted-foreground">Create projects and customize your workspace to match your workflow and business needs.</p>
                </li>

                <li className="animate-fade-up animate-once animate-delay-900 flex flex-col items-center text-center">
                    <div className="animate-bounce-slow mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white [animation-delay:400ms]" aria-hidden="true">
                        <span className="text-xl font-bold">3</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Build Your Team</h3>
                    <p className="text-muted-foreground">
                        Invite team members, assign them to projects, and set hourly rates for accurate time tracking.
                    </p>
                </li>

                <li className="animate-fade-up animate-once animate-delay-[1100ms] flex flex-col items-center text-center">
                    <div className="animate-bounce-slow mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white [animation-delay:600ms]" aria-hidden="true">
                        <span className="text-xl font-bold">4</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">Start Tracking Time</h3>
                    <p className="text-muted-foreground">
                        Track time with a single click, generate reports, and optimize your productivity with data-driven insights.
                    </p>
                </li>
            </ol>

            <div className="mt-16 flex justify-center">
                <div className="animate-fade-up animate-once animate-delay-[1300ms] flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 transition-transform hover:scale-105" role="note">
                    <Zap className="h-5 w-5 animate-pulse text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium">Most users are up and running in less than 10 minutes!</span>
                </div>
            </div>
        </section>
    )
}
