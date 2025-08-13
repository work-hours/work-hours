export default function WelcomeSection() {
    return (
        <section className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Welcome back</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Here's an overview of your productivity and team activity</p>
            </div>
        </section>
    )
}
