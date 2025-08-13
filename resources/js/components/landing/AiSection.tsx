import { BrainCircuit, Clock, Lightbulb, MessageSquareText, Sparkles, Zap } from 'lucide-react'

export default function AiSection() {
    return (
        <section className="relative w-full" aria-label="AI Assistant features">
            <div className="mb-14 text-center">
                <span className="mb-3 inline-block text-sm font-medium text-purple-600 dark:text-purple-400">AI ASSISTANT</span>

                <h2 className="mb-4 text-3xl font-medium text-gray-900 md:text-4xl dark:text-gray-100">
                    <span className="relative inline-block">
                        Intelligent productivity
                        <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-70"></span>
                    </span>
                </h2>

                <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
                    Our AI assistant analyzes your work patterns, provides insights, and helps you optimize your time.
                </p>
            </div>

            {/* Featured AI capability with minimal design */}
            <div className="relative mb-16 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20">
                        <BrainCircuit className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>

                    <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Smart Work Assistant</h3>
                            <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                <Sparkles className="mr-1 h-3 w-3" />
                                New
                            </span>
                        </div>

                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                            Ask questions about your projects, get summaries of your work, and receive personalized recommendations to boost your
                            productivity.
                        </p>

                        <div className="flex flex-wrap gap-2">
                            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <Zap className="mr-1.5 h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                Instant Insights
                            </div>
                            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <MessageSquareText className="mr-1.5 h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                Natural Conversations
                            </div>
                            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <Lightbulb className="mr-1.5 h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                Smart Suggestions
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Features Grid with minimal design */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Feature 1: Time Analysis */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-purple-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-800/50">
                    <div className="flex items-start gap-4 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                        </div>

                        <div>
                            <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-gray-200">Time Analysis</h3>
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                Get AI-powered insights about your time usage patterns, productivity peaks, and suggestions for optimizing your
                                schedule.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span className="mr-1 text-purple-600 dark:text-purple-400">•</span>
                                    Productivity patterns
                                </span>
                                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span className="mr-1 text-purple-600 dark:text-purple-400">•</span>
                                    Time optimization
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 2: Project Insights */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-purple-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-800/50">
                    <div className="flex items-start gap-4 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                        </div>

                        <div>
                            <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-gray-200">Project Insights</h3>
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                Ask questions about your projects, get summaries of work done, and receive AI-generated reports on project progress.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span className="mr-1 text-purple-600 dark:text-purple-400">•</span>
                                    Project summaries
                                </span>
                                <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span className="mr-1 text-purple-600 dark:text-purple-400">•</span>
                                    Smart Q&A
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call-to-action button with minimal design */}
            <div className="mt-12 text-center">
                <button className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Try AI Assistant
                </button>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Powered by advanced machine learning</p>
            </div>
        </section>
    )
}
