import { Link } from '@inertiajs/react'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Hero() {
    return (
        <section className="mb-24 w-full pt-12 lg:pt-20" aria-label="Hero section">
            <div className="relative mx-auto w-9/12">
                {/* Timesheet header stamp */}
                <div className="absolute -top-4 right-4 rotate-6 border-2 border-red-800/30 px-4 py-2 text-sm font-bold tracking-wider text-red-800/70 uppercase md:right-10">
                    Time Sheet
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    {/* Vintage rubber stamp effect */}
                    <div className="mx-auto mb-8 w-fit">
                        <div className="rotate-[-2deg] border-2 border-blue-900/40 bg-blue-100/20 px-6 py-3">
                            <span className="text-sm font-bold tracking-wider text-blue-900/80 uppercase">Time Tracking & Insights</span>
                        </div>
                    </div>

                    <h1 className="mb-6 font-['Courier_New',monospace] text-4xl font-bold tracking-tight text-gray-800 uppercase md:text-6xl lg:text-7xl">
                        Track Your Work Hours{' '}
                        <span className="relative text-blue-900">
                            Effortlessly
                            <div className="absolute right-0 bottom-0 left-0 h-1 bg-blue-900/30"></div>
                        </span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl font-['Courier_New',monospace] text-lg text-gray-700 md:text-xl">
                        A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain
                        valuable insights into how you spend your time.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center gap-2 border-2 border-blue-900 bg-blue-900 px-8 py-3 text-base font-bold text-white transition-colors hover:bg-blue-800"
                            aria-label="Start using Work Hours for free"
                        >
                            Start for free
                            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center justify-center gap-2 border-2 border-gray-800 bg-transparent px-8 py-3 text-base font-bold text-gray-800 transition-colors hover:bg-gray-100"
                            aria-label="Learn more about Work Hours features"
                        >
                            Explore features
                        </Link>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4" aria-label="Key statistics">
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

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground" aria-label="Key benefits">
                        <div className="animate-fade-up animate-once animate-delay-[1100ms] flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                            <span className="text-sm font-medium">No credit card required</span>
                        </div>
                        <div className="animate-fade-up animate-once animate-delay-[1200ms] flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                            <span className="text-sm font-medium">Free for all</span>
                        </div>
                        <div className="animate-fade-up animate-once animate-delay-[1300ms] flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                            <span className="text-sm font-medium">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
