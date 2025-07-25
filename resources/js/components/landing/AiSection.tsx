import { BrainCircuit, Sparkles, MessageSquareText, Lightbulb, Zap, Clock } from 'lucide-react'

export default function AiSection() {
    return (
        <section id="ai-assistant" className="container mx-auto mb-24 px-6 lg:px-8" aria-label="AI Assistant features">
            <div className="mb-16 text-center">
                {/* Typewriter-style header with decorative elements */}
                <div className="relative mx-auto mb-8 w-fit">
                    <div className="border-2 border-gray-800/70 px-10 py-3 dark:border-gray-200/70">
                        <span className="font-bold tracking-widest text-gray-800 uppercase dark:text-gray-200">AI Assistant</span>
                    </div>
                    {/* Decorative elements with pulsing animation */}
                    <div className="absolute -top-3 -right-3 flex h-10 w-10 rotate-12 items-center justify-center border-2 border-purple-600/80 bg-purple-100/50 animate-pulse dark:border-purple-400/80 dark:bg-purple-900/50">
                        <span className="text-sm font-bold text-purple-700 dark:text-purple-300">AI</span>
                    </div>
                    <div className="absolute -bottom-3 -left-3 flex h-10 w-10 -rotate-12 items-center justify-center border-2 border-purple-600/80 bg-purple-100/50 animate-pulse dark:border-purple-400/80 dark:bg-purple-900/50">
                        <Sparkles className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                    </div>
                </div>

                <h2 className="mt-4 mb-6 text-3xl font-bold tracking-tight text-gray-800 uppercase md:text-5xl dark:text-gray-200">
                    <span className="relative">
                        Intelligent Assistant
                        {/* Highlight underline */}
                        <span className="absolute -bottom-1 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-blue-500"></span>
                    </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
                    Boost your productivity with our powerful AI assistant that helps you manage time, analyze work patterns, and get insights.
                </p>

                {/* Decorative typewriter keys with AI theme */}
                <div className="mt-8 flex justify-center gap-2">
                    {['A', 'I', '-', 'P', 'O', 'W', 'E', 'R', 'E', 'D'].map((letter, index) => (
                        <div
                            key={index}
                            className={`flex h-8 w-8 items-center justify-center border ${
                                index === 0 || index === 1
                                    ? 'border-purple-500 bg-purple-100/70 dark:border-purple-500 dark:bg-purple-900/30'
                                    : 'border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700'
                            } shadow-sm`}
                        >
                            <span className={`text-xs font-bold ${
                                index === 0 || index === 1
                                    ? 'text-purple-700 dark:text-purple-300'
                                    : 'text-gray-700 dark:text-gray-300'
                            }`}>{letter}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured AI capability with spotlight effect */}
            <div className="relative mb-16 overflow-hidden rounded-lg border-2 border-purple-500/70 bg-gradient-to-br from-white to-purple-50 p-8 shadow-lg dark:from-gray-800 dark:to-purple-950/30">
                {/* Spotlight effect */}
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-300/20 blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center md:flex-row md:items-start md:gap-8">
                    <div className="mb-6 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 p-4 shadow-inner dark:bg-purple-900/50 md:mb-0">
                        <BrainCircuit className="h-12 w-12 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                        <div className="mb-4 flex items-center">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Smart Work Assistant</h3>
                            <span className="ml-3 inline-flex items-center rounded-md bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                <Sparkles className="mr-1 h-3.5 w-3.5" />
                                NEW
                            </span>
                        </div>
                        <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                            Our AI assistant analyzes your work patterns, provides insights, and helps you optimize your time. Ask questions about your projects, get summaries of your work, and receive personalized recommendations.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 dark:border-purple-800 dark:bg-purple-900/30">
                                <Zap className="mr-1.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Instant Insights</span>
                            </div>
                            <div className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 dark:border-purple-800 dark:bg-purple-900/30">
                                <MessageSquareText className="mr-1.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Natural Conversations</span>
                            </div>
                            <div className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 dark:border-purple-800 dark:bg-purple-900/30">
                                <Lightbulb className="mr-1.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Smart Suggestions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Features Grid */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* Feature 1: Time Analysis */}
                <div className="group relative overflow-hidden border-2 border-gray-300 bg-white transition-all hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-700">
                    {/* Feature header with typewriter styling */}
                    <div className="border-b-2 border-gray-400 bg-gray-100 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 uppercase dark:text-gray-200">Time Analysis</h3>
                            <div className="flex h-8 w-8 items-center justify-center border border-purple-500 bg-purple-100 dark:border-purple-500 dark:bg-purple-900/50">
                                <Clock className="h-5 w-5 text-purple-700 dark:text-purple-300" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Feature content */}
                    <div className="p-5">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Get AI-powered insights about your time usage patterns, productivity peaks, and suggestions for optimizing your schedule.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-700">
                                <span className="mr-1 font-bold text-purple-600 dark:text-purple-400">✓</span>
                                <span className="text-xs text-gray-700 uppercase dark:text-gray-300">Productivity patterns</span>
                            </div>
                            <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-700">
                                <span className="mr-1 font-bold text-purple-600 dark:text-purple-400">✓</span>
                                <span className="text-xs text-gray-700 uppercase dark:text-gray-300">Time optimization</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 2: Project Insights */}
                <div className="group relative overflow-hidden border-2 border-gray-300 bg-white transition-all hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-700">
                    {/* Feature header with typewriter styling */}
                    <div className="border-b-2 border-gray-400 bg-gray-100 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 uppercase dark:text-gray-200">Project Insights</h3>
                            <div className="flex h-8 w-8 items-center justify-center border border-purple-500 bg-purple-100 dark:border-purple-500 dark:bg-purple-900/50">
                                <Lightbulb className="h-5 w-5 text-purple-700 dark:text-purple-300" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Feature content */}
                    <div className="p-5">
                        <div className="mb-3 flex">
                            <span className="mr-2 inline-flex items-center rounded-none border border-purple-800/40 px-2 py-0.5 text-xs font-bold text-purple-800/70 uppercase dark:border-purple-400/40 dark:text-purple-400/90">
                                Featured
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Ask questions about your projects, get summaries of work done, and receive AI-generated reports on project progress.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-700">
                                <span className="mr-1 font-bold text-purple-600 dark:text-purple-400">✓</span>
                                <span className="text-xs text-gray-700 uppercase dark:text-gray-300">Project summaries</span>
                            </div>
                            <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-700">
                                <span className="mr-1 font-bold text-purple-600 dark:text-purple-400">✓</span>
                                <span className="text-xs text-gray-700 uppercase dark:text-gray-300">Smart Q&A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call-to-action button */}
            <div className="mt-12 text-center">
                <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-3 font-medium text-white transition duration-300 ease-out hover:from-purple-700 hover:to-blue-600">
                    <span className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/20 transition-all duration-500 ease-in-out group-hover:scale-150"></span>
                    <span className="relative flex items-center">
                        <BrainCircuit className="mr-2 h-5 w-5" />
                        Try AI Assistant Now
                    </span>
                </button>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Powered by advanced machine learning to help you work smarter
                </p>
            </div>
        </section>
    )
}
