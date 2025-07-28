import AiChat from '@/components/ai-chat'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { BrainCircuit, Clock, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import DeleteChatHistory from '@/components/delete-chat-history'
import { getChatHistories } from '@actions/AiChatController'

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

    // Load chat histories when the component mounts
    useEffect(() => {
        loadChatHistories().then()
    }, [])

    // Listen for custom event to open the AI chat
    useEffect(() => {
        const handleOpenAiChat = () => {
            setIsOpen(true)
        }

        // Add event listener
        window.addEventListener('open-ai-chat', handleOpenAiChat)

        // Clean up
        return () => {
            window.removeEventListener('open-ai-chat', handleOpenAiChat)
        }
    }, [])

    // Function to load chat histories
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

    // Function to handle chat deletion
    const handleChatDeleted = (id: number) => {
        // If the deleted chat was selected, clear the selection
        if (selectedChatId === id) {
            setSelectedChatId(null)
        }
        // Reload chat histories
        loadChatHistories()
    }

    // Function to start a new chat
    const handleNewChat = () => {
        setSelectedChatId(null)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div className="fixed right-4 bottom-24 z-50 duration-300 animate-in fade-in slide-in-from-right-5 hidden">
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-xl border border-primary/20 bg-background shadow-md transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <BrainCircuit className="h-7 w-7 text-primary" />
                            <span className="text-xs font-semibold text-primary">Ask AI</span>
                        </div>
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent className="overflow-hidden p-0 sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
                <div className="flex h-full">
                    {/* Chat History Sidebar */}
                    <div className="w-64 border-r border-border bg-muted/30">
                        <div className="border-b border-border p-4">
                            <h3 className="text-lg font-semibold">Chat History</h3>
                            <Button variant="outline" size="sm" className="mt-2 w-full gap-2" onClick={handleNewChat}>
                                <Plus className="h-4 w-4" />
                                New Chat
                            </Button>
                        </div>
                        <ScrollArea className="h-[calc(100vh-120px)]">
                            {isLoading ? (
                                <div className="flex h-20 items-center justify-center">
                                    <p className="text-sm text-muted-foreground">Loading...</p>
                                </div>
                            ) : chatHistories.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-sm text-muted-foreground">No chat history yet</p>
                                </div>
                            ) : (
                                <div className="space-y-1 p-2">
                                    {chatHistories.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className={`group flex cursor-pointer items-start justify-between rounded-md p-2 hover:bg-muted ${
                                                selectedChatId === chat.id ? 'bg-muted' : ''
                                            }`}
                                            onClick={() => setSelectedChatId(chat.id)}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium">{chat.title}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(chat.updated_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 transition-opacity group-hover:opacity-100">
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
