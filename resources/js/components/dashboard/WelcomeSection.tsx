import QuickActions from '@/components/dashboard/QuickActions'

export default function WelcomeSection() {
    return (
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="font-['Courier_New',monospace] text-3xl font-bold tracking-wider text-gray-800 uppercase">Welcome back!</h1>
                <p className="mt-1 font-['Courier_New',monospace] text-gray-700">Here's an overview of your team's activity</p>
            </div>
            <QuickActions />
        </section>
    )
}
