import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Navigation */}
            <nav className="container mx-auto flex items-center justify-between px-4 py-6">
                <div className="flex items-center gap-2">
                    <AppLogoIcon className="h-20 w-20 text-primary" />
                </div>
                <div className="flex items-center gap-12">
                    <Link href={route('login')} className="text-gray-600 transition-colors hover:text-gray-900">
                        Login
                    </Link>
                    <Link href={route('register')} className="rounded-lg bg-primary px-4 py-2 text-white shadow-sm transition-all hover:shadow-md">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto mb-12 px-4">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
                        Track Your Work Hours <span className="text-primary">Effortlessly</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
                        A simple, intuitive time tracking solution for teams and individuals. Boost productivity and gain insights into how you spend
                        your time.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href={route('register')}
                            className="transform rounded-lg bg-primary px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            Start Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto mb-12 px-4">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Powerful Features</h2>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600">Everything you need to track, analyze, and optimize your work hours.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-900">Time Tracking</h3>
                        <p className="text-gray-600">Track time with a single click. Add notes and categorize your activities for better insights.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-900">Detailed Reports</h3>
                        <p className="text-gray-600">Generate comprehensive reports to analyze your productivity and identify improvement areas.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-gray-900">Team Collaboration</h3>
                        <p className="text-gray-600">Manage your team's time, assign tasks, and track progress all in one place.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary/5 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Ready to Optimize Your Time?</h2>
                    <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
                        Join thousands of professionals who have transformed how they track and manage their time.
                    </p>
                    <Link
                        href={route('register')}
                        className="inline-block transform rounded-lg bg-primary px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                        Start Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
