import FeatureLayout from '@/components/features/FeatureLayout'
import { AlertCircle, CheckCircle, Clock, Download, FileText, Upload } from 'lucide-react'

export default function BulkUpload() {
    return (
        <FeatureLayout title="Bulk Upload" icon={<Upload className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-10">
                <section className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Save time and reduce manual data entry with our powerful bulk upload feature. Import multiple time logs, projects, or client
                        records at once, allowing you to quickly migrate data or update your records in batches.
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                            <span className="mr-2">
                                <Upload className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="font-medium">Pro Tip:</span> Use our template validator before uploading to ensure your data is
                                formatted correctly and avoid any import errors.
                            </span>
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Key Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Download className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Template Download</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Download pre-formatted templates for different data types to ensure your information is structured correctly.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Upload className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Multiple File Formats</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Support for CSV, Excel, and JSON file formats, giving you flexibility in how you prepare your data.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Validation & Error Handling</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Automatic validation of your data with detailed error reports to help you quickly identify and fix issues.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Batch Processing</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Process large datasets efficiently with our optimized batch processing system, saving you time and resources.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Upload Process
                    </h2>
                    <ol className="space-y-6">
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                1
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Download Template</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Select the data type you want to upload (time logs, projects, clients) and download the corresponding template.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Prepare Your Data</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Fill in the template with your data, following the required format and field specifications.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Validate Your Data</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Use our validator tool to check your data for errors before uploading, saving time on potential resubmissions.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Upload & Confirm</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Upload your file and review the confirmation summary before finalizing the import process.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Supported Data Types
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Clock className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Time Logs</h3>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Import historical time entries with project details, dates, durations, and descriptions.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <FileText className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Projects</h3>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Create multiple projects at once with client associations, billing rates, and status information.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <AlertCircle className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Tasks</h3>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Import task lists with details, priorities, assignments, and deadlines for quick project setup.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Benefits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Save time with batch processing of multiple records</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduce manual data entry errors with validation</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Easy migration from other time tracking systems</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Efficiently update multiple records simultaneously</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Detailed error reporting for quick troubleshooting</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Support for standard file formats (CSV, Excel, JSON)</p>
                        </div>
                    </div>
                </section>

                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Import Your Data?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Start using our bulk upload feature today and save time on manual data entry.
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
