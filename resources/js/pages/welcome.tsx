import AppLogoIcon from '@/components/app-logo-icon'
import { Head, Link } from '@inertiajs/react'
import { ArrowRight, Award, BarChart2, Briefcase, Calendar, CheckCircle, Clock, Shield, Star, Users, Zap } from 'lucide-react'

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
                    <div className="absolute bottom-40 left-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl"></div>

                    <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        ✨ New: Automated Time Tracking & AI Insights
                    </div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        Track Your Work Hours{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Effortlessly</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                        A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain
                        valuable insights into how you spend your time.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href={route('register')}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
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

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-foreground">10k+</span>
                            <span className="text-sm text-muted-foreground">Active Users</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-foreground">5M+</span>
                            <span className="text-sm text-muted-foreground">Hours Tracked</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-foreground">98%</span>
                            <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-foreground">30%</span>
                            <span className="text-sm text-muted-foreground">Productivity Boost</span>
                        </div>
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
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto mb-24 px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Powerful Features</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Everything you need to track, analyze, and optimize your work hours.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <Clock className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Time Tracking</h3>
                        <p className="text-muted-foreground">
                            Track time with a single click. Add notes and categorize your activities for better insights. Set timers, track breaks,
                            and monitor overtime automatically.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <BarChart2 className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Detailed Reports</h3>
                        <p className="text-muted-foreground">
                            Generate comprehensive reports to analyze your productivity and identify improvement areas. Export data in multiple
                            formats for seamless integration with other tools.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <Users className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Team Collaboration</h3>
                        <p className="text-muted-foreground">
                            Manage your team's time, assign tasks, and track progress all in one place. Real-time updates and notifications keep
                            everyone in sync.
                        </p>
                    </div>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {/* Feature 4 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <Calendar className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Project Planning</h3>
                        <p className="text-muted-foreground">
                            Plan projects, set deadlines, and allocate resources efficiently. Our calendar view makes scheduling and time management
                            intuitive.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <Briefcase className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Client Billing</h3>
                        <p className="text-muted-foreground">
                            Automatically generate invoices based on tracked time. Set different rates for clients, projects, or team members for
                            accurate billing.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="group rounded-xl border border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                            <Shield className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Data Security</h3>
                        <p className="text-muted-foreground">
                            Your data is protected with enterprise-grade security. Role-based access control ensures sensitive information stays
                            private.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="container mx-auto mb-24 px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">How It Works</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Get started with Work Hours in three simple steps</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                            <span className="text-xl font-bold">1</span>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Create Your Account</h3>
                        <p className="text-muted-foreground">
                            Sign up for free in less than a minute. No credit card required to get started with our basic plan.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                            <span className="text-xl font-bold">2</span>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-foreground">Set Up Your Projects</h3>
                        <p className="text-muted-foreground">
                            Create projects, invite team members, and customize your workspace to match your workflow.
                        </p>
                    </div>

                    {/* Step 3 */}
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

            {/* Testimonials Section */}
            <section id="testimonials" className="bg-gradient-to-r from-primary/5 to-primary/10 py-16 md:py-24">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">What Our Users Say</h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Trusted by thousands of teams and individuals worldwide</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Testimonial 1 */}
                        <div className="rounded-xl bg-card p-8 shadow-md">
                            <div className="mb-4 flex">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                            <p className="mb-6 text-muted-foreground italic">
                                "Work Hours has transformed how our agency tracks time. The detailed reports have helped us identify inefficiencies
                                and improve our billing accuracy by 30%."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <span className="text-lg font-bold">JD</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Jane Doe</h4>
                                    <p className="text-sm text-muted-foreground">Creative Director, Design Studio</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="rounded-xl bg-card p-8 shadow-md">
                            <div className="mb-4 flex">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                            <p className="mb-6 text-muted-foreground italic">
                                "As a freelancer, keeping track of billable hours was always a challenge. Work Hours makes it simple and the automated
                                invoicing feature saves me hours every month."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <span className="text-lg font-bold">MS</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Michael Smith</h4>
                                    <p className="text-sm text-muted-foreground">Independent Developer</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="rounded-xl bg-card p-8 shadow-md">
                            <div className="mb-4 flex">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                            <p className="mb-6 text-muted-foreground italic">
                                "Our team of 50+ uses Work Hours daily. The collaboration features and project management tools have improved our
                                productivity significantly."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <span className="text-lg font-bold">AJ</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Alex Johnson</h4>
                                    <p className="text-sm text-muted-foreground">Operations Manager, Tech Co.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <div className="flex items-center gap-2 rounded-full bg-white/80 px-6 py-3 shadow-sm">
                            <Award className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">Rated 4.9/5 stars by over 1,000 customers</span>
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
            <footer className="border-t border-border/40 py-12">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div className="flex flex-col">
                            <div className="mb-4 flex items-center gap-2">
                                <AppLogoIcon className="h-10 w-10 text-primary" />
                                <span className="text-lg font-bold text-foreground">WorkHours</span>
                            </div>
                            <p className="mb-4 text-sm text-muted-foreground">Simplifying time tracking for teams and individuals since 2023.</p>
                            <div className="flex gap-4">
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase">Product</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#features" className="text-muted-foreground hover:text-primary">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Integrations
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Changelog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase">Company</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#testimonials" className="text-muted-foreground hover:text-primary">
                                        Customers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Cookie Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        GDPR Compliance
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-primary">
                                        Security
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-border/40 pt-8 text-center">
                        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Work Hours. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
