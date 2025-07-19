import QuickActions from '@/components/dashboard/QuickActions'

export default function WelcomeSection() {
    return (
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-800 font-['Courier_New',monospace]">Welcome back!</h1>
                <p className="mt-1 text-gray-700 font-['Courier_New',monospace]">Here's an overview of your team's activity</p>
            </div>
            <QuickActions />
        </section>
    )
}
