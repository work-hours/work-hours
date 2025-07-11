import { Link } from '@inertiajs/react'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Hero() {
    return (
        <section className="mb-24 pt-12 lg:pt-20 w-full">
            <div className="w-9/12 mx-auto">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="absolute top-40 -left-10 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl"></div>
                    <div className="absolute top-60 right-10 h-64 w-64 animate-pulse rounded-full bg-primary/10 blur-3xl [animation-delay:1s]"></div>
                    <div className="absolute bottom-40 left-20 h-48 w-48 animate-pulse rounded-full bg-primary/10 blur-3xl [animation-delay:2s]"></div>

                    <div className="animate-fade-down animate-once mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        ✨ New: Time Tracking & Insights
                    </div>

                    <h1 className="animate-fade-up animate-once mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        Track Your Work Hours{' '}
                        <span className="animate-fade-in animate-once animate-delay-500 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            Effortlessly
                        </span>
                    </h1>
                    <p className="animate-fade-up animate-once animate-delay-300 mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                        A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain
                        valuable insights into how you spend your time.
                    </p>
                    <div className="animate-fade-up animate-once animate-delay-500 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href={route('register')}
                            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <span className="animate-pulse-glow absolute inset-0 -z-10 rounded-full"></span>
                            Start for free
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card px-8 py-3.5 text-base font-medium text-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                            Explore features
                        </Link>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div className="animate-fade-right animate-once animate-delay-700 flex flex-col items-center">
                            <span className="animate-count-up text-3xl font-bold text-foreground">10k+</span>
                            <span className="text-sm text-muted-foreground">Active Users</span>
                        </div>
                        <div className="animate-fade-right animate-once animate-delay-[800ms] flex flex-col items-center">
                            <span className="animate-count-up text-3xl font-bold text-foreground">5M+</span>
                            <span className="text-sm text-muted-foreground">Hours Tracked</span>
                        </div>
                        <div className="animate-fade-right animate-once animate-delay-[900ms] flex flex-col items-center">
                            <span className="animate-count-up text-3xl font-bold text-foreground">98%</span>
                            <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                        </div>
                        <div className="animate-fade-right animate-once animate-delay-[1000ms] flex flex-col items-center">
                            <span className="animate-count-up text-3xl font-bold text-foreground">30%</span>
                            <span className="text-sm text-muted-foreground">Productivity Boost</span>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
                        <div className="animate-fade-up animate-once animate-delay-[1100ms] flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">No credit card required</span>
                        </div>
                        <div className="animate-fade-up animate-once animate-delay-[1200ms] flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">Free for all</span>
                        </div>
                        <div className="animate-fade-up animate-once animate-delay-[1300ms] flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
