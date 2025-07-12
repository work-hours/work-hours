import QuickActions from '@/components/dashboard/QuickActions'

export default function WelcomeSection() {
    return (
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back!</h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Here's an overview of your team's activity</p>
            </div>
            <QuickActions />
        </section>
    )
}
