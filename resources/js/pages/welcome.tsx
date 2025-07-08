import AppLogoIcon from '@/components/app-logo-icon';
import { Head, Link } from '@inertiajs/react';
import { Clock, BarChart2, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
            <Head title="Work Hours - Track Your Time Effortlessly" />

            {/* Navigation */}
            <nav className="container mx-auto flex items-center justify-between px-6 py-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <AppLogoIcon className="h-16 w-16 text-primary transition-all hover:scale-105" />
                    <span className="text-xl font-bold tracking-tight text-foreground">Work Hours</span>
                </div>
                <div className="flex items-center gap-6 md:gap-8">
                    <Link href={route('login')} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                        Sign in
                    </Link>
                    <Link
                        href={route('register')}
                        className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto mb-24 px-6 pt-12 lg:px-8 lg:pt-20">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Decorative elements */}
                    <div className="absolute top-40 -left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
                    <div className="absolute top-60 right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        Track Your Work Hours <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Effortlessly</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                        A simple, intuitive time tracking solution for teams and individuals. Boost productivity and gain insights into how you spend
                        your time.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href={route('register')}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            Start for free
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">Free for small teams</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto mb-24 px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Powerful Features</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Everything you need to track, analyze, and optimize your work hours.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <Clock className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Time Tracking</h3>
                        <p className="text-muted-foreground">Track time with a single click. Add notes and categorize your activities for better insights.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <BarChart2 className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Detailed Reports</h3>
                        <p className="text-muted-foreground">Generate comprehensive reports to analyze your productivity and identify improvement areas.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <Users className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Team Collaboration</h3>
                        <p className="text-muted-foreground">Manage your team's time, assign tasks, and track progress all in one place.</p>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="container mx-auto mb-24 px-6 lg:px-8">
                <div className="rounded-2xl bg-primary/5 p-8 md:p-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            "WorkHours has transformed how our team tracks time. We've increased productivity by 35% since implementing it."
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="mb-2 h-12 w-12 overflow-hidden rounded-full bg-primary/20">
                                {/* Avatar placeholder */}
                                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">JD</div>
                            </div>
                            <p className="font-medium text-foreground">Jane Doe</p>
                            <p className="text-sm text-muted-foreground">Product Manager, Acme Inc.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
                <div className="container mx-auto px-6 text-center lg:px-8">
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Ready to Optimize Your Time?</h2>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                        Join thousands of professionals who have transformed how they track and manage their time.
                    </p>
                    <Link
                        href={route('register')}
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                        Get started today
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <p className="mt-6 text-sm text-muted-foreground">No credit card required</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 py-8">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="h-8 w-8 text-primary" />
                            <span className="text-sm font-medium text-foreground">WorkHours</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Work Hours. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
