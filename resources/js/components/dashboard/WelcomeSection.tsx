export default function WelcomeSection() {
    return (
        <section className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
                <p className="mt-1 text-sm text-muted-foreground">Here's an overview of your team's activity</p>
            </div>
        </section>
    )
}
