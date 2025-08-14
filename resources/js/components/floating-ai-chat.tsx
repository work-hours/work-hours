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
                        className="h-14 w-14 rounded-lg border border-slate-200 bg-white shadow-md transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <BrainCircuit className="h-6 w-6 text-primary" />
                            <span className="text-xs font-medium text-slate-600">Ask AI</span>
                        </div>
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent className="overflow-hidden p-0 sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
                <div className="flex h-full">
                    {/* Chat History Sidebar */}
                    <div className="w-60 border-r border-slate-200 bg-slate-50">
                        <div className="border-b border-slate-200 p-3">
                            <h3 className="text-sm font-medium text-slate-700">Chat History</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full gap-1 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                onClick={handleNewChat}
                            >
                                <Plus className="h-3 w-3" />
                                New Chat
                            </Button>
                        </div>
                        <ScrollArea className="h-[calc(100vh-120px)]">
                            {isLoading ? (
                                <div className="flex h-16 items-center justify-center">
                                    <p className="text-xs text-slate-500">Loading...</p>
                                </div>
                            ) : chatHistories.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-xs text-slate-500">No chat history yet</p>
                                </div>
                            ) : (
                                <div className="space-y-0.5 p-2">
                                    {chatHistories.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className={`group flex cursor-pointer items-start justify-between rounded-md p-2 transition-colors duration-150 hover:bg-slate-100 ${
                                                selectedChatId === chat.id ? 'bg-slate-100' : ''
                                            }`}
                                            onClick={() => setSelectedChatId(chat.id)}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-medium text-slate-700">{chat.title}</p>
                                                    <p className="text-xs text-slate-500">{new Date(chat.updated_at).toLocaleDateString()}</p>
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
