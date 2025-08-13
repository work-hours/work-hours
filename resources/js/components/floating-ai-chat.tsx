import AiChat from '@/components/ai-chat'
import DeleteChatHistory from '@/components/delete-chat-history'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { getChatHistories } from '@actions/AiChatController'
import { BrainCircuit, Clock, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

type ChatHistory = {
    id: number
    title: string
    messages: Array<{
        id: string
        content: string
        isUser: boolean
        timestamp: string
    }>
    created_at: string
    updated_at: string
}

type FloatingAiChatProps = {
    projects?: Array<{ id: number; name: string }>
    timeLogs?: Array<{
        id: number
        project_name: string
        duration: number
        note: string
    }>
}

export default function FloatingAiChat({ projects = [] }: FloatingAiChatProps) {
    const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        loadChatHistories().then()
    }, [])

    useEffect(() => {
        const handleOpenAiChat = () => {
            setIsOpen(true)
        }

        window.addEventListener('open-ai-chat', handleOpenAiChat)

        return () => {
            window.removeEventListener('open-ai-chat', handleOpenAiChat)
        }
    }, [])

    const loadChatHistories = async () => {
        try {
            setIsLoading(true)
            const response = await getChatHistories.call({})

            if (response && response.ok) {
                const data = await response.json()
                if (data.success) {
                    setChatHistories(data.histories)
                }
            }
        } catch (error) {
            console.error('Error loading chat histories:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChatDeleted = (id: number) => {
        if (selectedChatId === id) {
            setSelectedChatId(null)
        }

        loadChatHistories()
    }

    const handleNewChat = () => {
        setSelectedChatId(null)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div className="fixed right-4 bottom-24 z-50 hidden duration-300 animate-in fade-in slide-in-from-right-5">
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-xl border border-neutral-200 bg-white shadow-md transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/70"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <BrainCircuit className="h-7 w-7 text-neutral-700 dark:text-neutral-300" />
                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Ask AI</span>
                        </div>
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent className="overflow-hidden p-0 sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
                <div className="flex h-full">
                    {/* Chat History Sidebar */}
                    <div className="w-64 border-r border-neutral-200 bg-neutral-50/70 dark:border-neutral-700 dark:bg-neutral-900/30">
                        <div className="border-b border-neutral-200 p-4 dark:border-neutral-700">
                            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Chat History</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full gap-2 border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                onClick={handleNewChat}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                New Chat
                            </Button>
                        </div>
                        <ScrollArea className="h-[calc(100vh-120px)]">
                            {isLoading ? (
                                <div className="flex h-20 items-center justify-center">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading...</p>
                                </div>
                            ) : chatHistories.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">No chat history yet</p>
                                </div>
                            ) : (
                                <div className="space-y-1 p-2">
                                    {chatHistories.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className={`group flex cursor-pointer items-start justify-between rounded-md p-2 transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 ${
                                                selectedChatId === chat.id ? 'bg-neutral-100 dark:bg-neutral-800/60' : ''
                                            }`}
                                            onClick={() => setSelectedChatId(chat.id)}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{chat.title}</p>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(chat.updated_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                <DeleteChatHistory chatId={chat.id} onDelete={() => handleChatDeleted(chat.id)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1">
                        <AiChat projects={projects} chatHistoryId={selectedChatId} onChatSaved={loadChatHistories} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
