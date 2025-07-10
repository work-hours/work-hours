import { Head } from '@inertiajs/react'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
            <Head title="Work Hours - Track Your Time Effortlessly" />
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </div>
    )
}
