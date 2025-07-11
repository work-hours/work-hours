import LegalLayout from '@/components/legal/LegalLayout'

export default function Security() {
    return (
        <LegalLayout title="Security">
            <div className="space-y-8">
                {/* Commitment Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Our Commitment to Security</h2>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <p className="leading-relaxed">
                            At <span className="font-semibold text-primary">Work Hours</span>, we take the security of your data very seriously. We
                            employ industry-standard security measures to protect your personal information and ensure the integrity of our platform.
                        </p>
                    </div>
                </section>

                {/* Data Protection Measures Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Data Protection Measures</h2>
                    <p className="leading-relaxed">We implement various security measures to maintain the safety of your personal information:</p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Encryption:</span> All data transmitted between your browser and our servers
                            is encrypted using TLS (Transport Layer Security).
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Secure Data Storage:</span> We store your data in secure, encrypted
                            databases with restricted access.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Regular Security Audits:</span> We conduct regular security audits and
                            vulnerability assessments to identify and address potential security issues.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Access Controls:</span> We implement strict access controls to ensure that
                            only authorized personnel can access sensitive data.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Monitoring:</span> We continuously monitor our systems for suspicious
                            activities and potential security breaches.
                        </li>
                    </ul>
                </section>

                {/* Account Security Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Account Security</h2>
                    <p className="leading-relaxed">We recommend the following practices to help keep your account secure:</p>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Strong Passwords</h3>
                            <p className="text-sm leading-relaxed">Use a strong, unique password for your Work Hours account.</p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Two-Factor Authentication</h3>
                            <p className="text-sm leading-relaxed">Enable two-factor authentication if available.</p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Credential Protection</h3>
                            <p className="text-sm leading-relaxed">Do not share your account credentials with others.</p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Session Management</h3>
                            <p className="text-sm leading-relaxed">Log out of your account when using shared or public computers.</p>
                        </div>
                    </div>
                </section>

                {/* Security Incident Response Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Security Incident Response</h2>
                    <p className="leading-relaxed">In the event of a security incident that affects your data, we will:</p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li className="leading-relaxed">Promptly investigate the incident to determine its scope and impact.</li>
                        <li className="leading-relaxed">Take immediate steps to contain and mitigate the incident.</li>
                        <li className="leading-relaxed">Notify affected users in accordance with applicable laws and regulations.</li>
                        <li className="leading-relaxed">Work with law enforcement agencies if necessary.</li>
                        <li className="leading-relaxed">Implement measures to prevent similar incidents in the future.</li>
                    </ul>
                </section>

                {/* Third-Party Security Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Third-Party Security</h2>
                    <p className="leading-relaxed">
                        We carefully select third-party service providers and ensure they maintain appropriate security measures to protect your data.
                        We regularly review their security practices and compliance with our security requirements.
                    </p>
                </section>

                {/* Security Updates Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Security Updates</h2>
                    <p className="leading-relaxed">
                        We continuously update our security measures to address new threats and vulnerabilities. We may update this Security Policy
                        from time to time to reflect changes in our security practices.
                    </p>
                </section>

                {/* Reporting Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Reporting Security Issues</h2>
                    <div className="rounded-lg border border-border/40 bg-card p-4 shadow-sm">
                        <p className="leading-relaxed">
                            If you discover a security vulnerability or have concerns about the security of our platform, please contact us
                            immediately at{' '}
                            <a href="mailto:security@workhours.com" className="font-medium text-primary hover:underline">
                                security@workhours.com
                            </a>
                            . We appreciate your help in keeping <span className="font-semibold text-primary">Work Hours</span> secure.
                        </p>
                    </div>
                </section>
            </div>
        </LegalLayout>
    )
}
