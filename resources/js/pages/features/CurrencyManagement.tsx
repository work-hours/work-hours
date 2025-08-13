import FeatureLayout from '@/components/features/FeatureLayout'
import { BarChart2, CheckCircle, DollarSign, Globe, RefreshCw, Settings } from 'lucide-react'

export default function CurrencyManagement() {
    return (
        <FeatureLayout title="Currency Management" icon={<DollarSign className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-10">
                {/* Introduction Section */}
                <section className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Work with multiple currencies across projects and clients with our comprehensive currency management system. Track earnings,
                        expenses, and billing in various currencies while maintaining accurate financial records.
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                            <span className="mr-2">
                                <Globe className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="font-medium">Pro Tip:</span> Set your preferred display currency for reports to see all financial
                                data converted to a single currency for easier analysis, while still maintaining the original currency information.
                            </span>
                        </p>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Key Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Currency Conversion</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Automatic currency conversion using up-to-date exchange rates for accurate financial reporting.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Multi-Currency Support</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Support for over 170 global currencies with proper formatting for each currency's display conventions.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Client-Specific Settings</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Assign different currencies to each client and project for accurate billing in their preferred currency.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <BarChart2 className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Unified Reporting</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Generate reports with all finances converted to your preferred currency for consistent analysis.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Exchange Rate Features Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Exchange Rate Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <RefreshCw className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Automatic Updates</h3>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Exchange rates are automatically updated daily from reliable financial data sources.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Settings className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Manual Override</h3>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Set custom exchange rates for specific transactions when needed for contract requirements.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <BarChart2 className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Historical Rates</h3>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Access historical exchange rates for accurate reporting of past transactions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        How It Works
                    </h2>
                    <ol className="space-y-6">
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                1
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Set Base Currency</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Configure your organization's base currency which will be used for accounting and financial reporting.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Assign Client Currencies</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Set the preferred currency for each client which will be used for invoices and communications.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track & Convert</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Record transactions in their original currency, with automatic conversion to your base currency in the background.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Generate Reports</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    View financial reports in any currency with accurate conversion rates applied for each transaction period.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                {/* Benefits Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Benefits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Simplify international client billing with local currency invoices</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Maintain accurate financial records in your base currency</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Generate consistent financial reports across multiple currencies</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduce manual conversion errors with automated exchange rates</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improve client relationships with localized billing options</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Track historical exchange rate changes for accurate reporting</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready for Global Financial Management?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Start using our currency management system today and streamline your international billing.
                            </p>
                        </div>
                        <div className="md:w-1/3">
                            <a
                                href={route('register')}
                                className="inline-flex items-center justify-center border-2 border-blue-900 bg-blue-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </FeatureLayout>
    )
}
