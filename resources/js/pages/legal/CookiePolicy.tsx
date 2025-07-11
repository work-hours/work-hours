import LegalLayout from '@/components/legal/LegalLayout'

export default function CookiePolicy() {
    return (
        <LegalLayout title="Cookie Policy">
            <div className="space-y-8">
                {/* What Are Cookies Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">What Are Cookies</h2>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <p className="leading-relaxed">
                            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web
                            browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more
                            useful to you.
                        </p>
                    </div>
                </section>

                {/* How We Use Cookies Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">How We Use Cookies</h2>
                    <p className="leading-relaxed">
                        When you use and access the Service, we may place a number of cookie files in your web browser. We use cookies for the
                        following purposes:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li className="leading-relaxed">To enable certain functions of the Service</li>
                        <li className="leading-relaxed">To provide analytics</li>
                        <li className="leading-relaxed">To store your preferences</li>
                        <li className="leading-relaxed">To enable advertisements delivery, including behavioral advertising</li>
                    </ul>
                    <p className="mt-4 leading-relaxed">
                        We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Essential Cookies</h3>
                            <p className="text-sm leading-relaxed">
                                We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.
                            </p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Preferences Cookies</h3>
                            <p className="text-sm leading-relaxed">
                                We may use preferences cookies to remember information that changes the way the Service behaves or looks, such as the
                                "remember me" functionality.
                            </p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Analytics Cookies</h3>
                            <p className="text-sm leading-relaxed">
                                We may use analytics cookies to track information how the Service is used so that we can make improvements.
                            </p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Advertising Cookies</h3>
                            <p className="text-sm leading-relaxed">
                                These cookies collect information about your visit to our website, the content you viewed, the links you followed and
                                information about your browser, device, and your IP address.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Third-Party Cookies Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Third-Party Cookies</h2>
                    <p className="leading-relaxed">
                        In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver
                        advertisements on and through the Service, and so on.
                    </p>
                </section>

                {/* Your Choices Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">What Are Your Choices Regarding Cookies</h2>
                    <p className="leading-relaxed">
                        If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your
                        web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of
                        the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
                    </p>
                </section>

                {/* More Information Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">
                        Where Can You Find More Information About Cookies
                    </h2>
                    <p className="leading-relaxed">You can learn more about cookies and the following third-party websites:</p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li className="leading-relaxed">
                            AllAboutCookies:{' '}
                            <a href="https://www.allaboutcookies.org/" className="font-medium text-primary hover:underline">
                                https://www.allaboutcookies.org/
                            </a>
                        </li>
                        <li className="leading-relaxed">
                            Network Advertising Initiative:{' '}
                            <a href="https://www.networkadvertising.org/" className="font-medium text-primary hover:underline">
                                https://www.networkadvertising.org/
                            </a>
                        </li>
                    </ul>
                </section>

                {/* Changes Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Changes to This Cookie Policy</h2>
                    <p className="leading-relaxed">
                        We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this
                        page.
                    </p>
                </section>

                {/* Contact Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about our Cookie Policy, please contact us at{' '}
                        <a href="mailto:cookies@workhours.com" className="font-medium text-primary hover:underline">
                            cookies@workhours.com
                        </a>
                        .
                    </p>
                </section>
            </div>
        </LegalLayout>
    )
}
