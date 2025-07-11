import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
    return (
        <section className="animate-background-shine bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
            <div className="container mx-auto px-6 text-center lg:px-8">
                <h2 className="animate-fade-up animate-once mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Ready to Optimize Your Time?
                </h2>
                <p className="animate-fade-up animate-once animate-delay-300 mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                    Join thousands of professionals who have transformed how they track and manage their time.
                </p>
                <Link
                    href={route('register')}
                    className="animate-fade-up animate-once animate-delay-500 group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                    <span className="animate-pulse-glow absolute inset-0 -z-10 rounded-full"></span>
                    Get started today
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <p className="animate-fade-up animate-once animate-delay-700 mt-6 text-sm text-muted-foreground">No credit card required</p>
            </div>
        </section>
    )
}
