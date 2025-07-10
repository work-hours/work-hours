import { Head } from '@inertiajs/react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export default function GDPRCompliance() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
            <Head title="GDPR Compliance - Work Hours" />
            <Navbar />

            <main className="container mx-auto px-6 py-12 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">GDPR Compliance</h1>

                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2>Our Commitment to GDPR Compliance</h2>
                    <p>
                        At Work Hours, we are committed to ensuring the privacy and protection of your personal data in compliance with the General Data Protection Regulation (GDPR). This page outlines our approach to GDPR compliance and your rights under this regulation.
                    </p>

                    <h2>What is GDPR?</h2>
                    <p>
                        The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area. It also addresses the export of personal data outside the EU and EEA areas.
                    </p>

                    <h2>How We Comply with GDPR</h2>
                    <p>
                        We have implemented several measures to ensure our compliance with GDPR:
                    </p>
                    <ul>
                        <li>Data Protection Officer: We have appointed a Data Protection Officer who is responsible for overseeing our data protection strategy and its implementation to ensure compliance with GDPR requirements.</li>
                        <li>Data Protection Impact Assessments: We conduct Data Protection Impact Assessments for all new projects involving personal data processing.</li>
                        <li>Data Processing Records: We maintain records of our data processing activities, including the purpose of processing, data sharing, and security measures.</li>
                        <li>Security Measures: We have implemented appropriate technical and organizational measures to ensure a level of security appropriate to the risk.</li>
                        <li>Data Breach Procedures: We have procedures in place to detect, report, and investigate personal data breaches.</li>
                    </ul>

                    <h2>Your Rights Under GDPR</h2>
                    <p>
                        Under GDPR, you have the following rights:
                    </p>
                    <ul>
                        <li>Right to Access: You have the right to request a copy of your personal data.</li>
                        <li>Right to Rectification: You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                        <li>Right to Erasure: You have the right to request that we erase your personal data, under certain conditions.</li>
                        <li>Right to Restrict Processing: You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                        <li>Right to Object to Processing: You have the right to object to our processing of your personal data, under certain conditions.</li>
                        <li>Right to Data Portability: You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                    </ul>

                    <h2>Data Transfer Outside the EU</h2>
                    <p>
                        We ensure that any transfer of personal data outside the EU is done in compliance with GDPR requirements. We use appropriate safeguards such as Standard Contractual Clauses or ensure that the recipient country has an adequacy decision from the European Commission.
                    </p>

                    <h2>Changes to Our GDPR Compliance Policy</h2>
                    <p>
                        We may update our GDPR Compliance Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about our GDPR Compliance Policy or would like to exercise any of your rights under GDPR, please contact our Data Protection Officer at gdpr@workhours.com.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
