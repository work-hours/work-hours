import LegalLayout from '@/components/legal/LegalLayout'

export default function GDPRCompliance() {
    return (
        <LegalLayout title="GDPR Compliance">
            <div className="space-y-8">
                {/* Commitment Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Our Commitment to GDPR Compliance</h2>
                    <p className="leading-relaxed">
                        At <span className="font-semibold text-primary">Work Hours</span>, we are committed to ensuring the privacy and protection of
                        your personal data in compliance with the General Data Protection Regulation (GDPR). This page outlines our approach to GDPR
                        compliance and your rights under this regulation.
                    </p>
                </section>

                {/* What is GDPR Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">What is GDPR?</h2>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <p className="leading-relaxed">
                            The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy for all individuals
                            within the European Union and the European Economic Area. It also addresses the export of personal data outside the EU and
                            EEA areas.
                        </p>
                    </div>
                </section>

                {/* Compliance Measures Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">How We Comply with GDPR</h2>
                    <p className="leading-relaxed">We have implemented several measures to ensure our compliance with GDPR:</p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Data Protection Officer:</span> We have appointed a Data Protection Officer
                            who is responsible for overseeing our data protection strategy and its implementation to ensure compliance with GDPR
                            requirements.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Data Protection Impact Assessments:</span> We conduct Data Protection Impact
                            Assessments for all new projects involving personal data processing.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Data Processing Records:</span> We maintain records of our data processing
                            activities, including the purpose of processing, data sharing, and security measures.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Security Measures:</span> We have implemented appropriate technical and
                            organizational measures to ensure a level of security appropriate to the risk.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Data Breach Procedures:</span> We have procedures in place to detect,
                            report, and investigate personal data breaches.
                        </li>
                    </ul>
                </section>

                {/* Your Rights Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Your Rights Under GDPR</h2>
                    <p className="leading-relaxed">Under GDPR, you have the following rights:</p>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Access</h3>
                            <p className="text-sm leading-relaxed">You have the right to request a copy of your personal data.</p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Rectification</h3>
                            <p className="text-sm leading-relaxed">
                                You have the right to request that we correct any information you believe is inaccurate or complete information you
                                believe is incomplete.
                            </p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Erasure</h3>
                            <p className="text-sm leading-relaxed">
                                You have the right to request that we erase your personal data, under certain conditions.
                            </p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Restrict Processing</h3>
                            <p className="text-sm leading-relaxed">
                                You have the right to request that we restrict the processing of your personal data, under certain conditions.
                            </p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Object to Processing</h3>
                            <p className="text-sm leading-relaxed">
                                You have the right to object to our processing of your personal data, under certain conditions.
                            </p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Data Portability</h3>
                            <p className="text-sm leading-relaxed">
                                You have the right to request that we transfer the data that we have collected to another organization, or directly to
                                you, under certain conditions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Data Transfer Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Data Transfer Outside the EU</h2>
                    <p className="leading-relaxed">
                        We ensure that any transfer of personal data outside the EU is done in compliance with GDPR requirements. We use appropriate
                        safeguards such as <span className="font-medium text-foreground">Standard Contractual Clauses</span> or ensure that the
                        recipient country has an <span className="font-medium text-foreground">adequacy decision</span> from the European Commission.
                    </p>
                </section>

                {/* Changes Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Changes to Our GDPR Compliance Policy</h2>
                    <p className="leading-relaxed">
                        We may update our GDPR Compliance Policy from time to time. We will notify you of any changes by posting the new policy on
                        this page.
                    </p>
                </section>

                {/* Contact Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about our GDPR Compliance Policy or would like to exercise any of your rights under GDPR, please
                        contact our Data Protection Officer at{' '}
                        <a href="mailto:gdpr@workhours.com" className="font-medium text-primary hover:underline">
                            gdpr@workhours.com
                        </a>
                        .
                    </p>
                </section>
            </div>
        </LegalLayout>
    )
}
