import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import AiChat from '@/components/ai-chat'
import { BrainCircuit, Trash2, Clock, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { getChatHistories, deleteChatHistory } from '@actions/AiChatController'

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

    // Load chat histories when component mounts
    useEffect(() => {
        loadChatHistories()
    }, [])

    // Function to load chat histories
    const loadChatHistories = async () => {
        try {
            setIsLoading(true)
            const response = await getChatHistories.call()

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

    // Function to delete a chat history
    const handleDeleteChat = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering the click on the parent element

        if (!confirm('Are you sure you want to delete this chat history?')) {
            return
        }

        try {
            const response = await deleteChatHistory.call({
                data: { id }
            })

            if (response && response.ok) {
                const data = await response.json()
                if (data.success) {
                    // If the deleted chat was selected, clear the selection
                    if (selectedChatId === id) {
                        setSelectedChatId(null)
                    }
                    // Reload chat histories
                    loadChatHistories()
                }
            }
        } catch (error) {
            console.error('Error deleting chat history:', error)
        }
    }

    // Function to start a new chat
    const handleNewChat = () => {
        setSelectedChatId(null)
    }

    return (
        <Sheet>
            <div className="fixed right-4 bottom-24 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-xl bg-background border border-primary/20 shadow-md hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <BrainCircuit className="h-7 w-7 text-primary" />
                            <span className="text-xs font-semibold text-primary">Ask AI</span>
                        </div>
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent className="p-0 overflow-hidden sm:max-w-md md:max-w-xl lg:max-w-2xl">
                <div className="flex h-full">
                    {/* Chat History Sidebar */}
                    <div className="w-64 border-r border-border bg-muted/30">
                        <div className="p-4 border-b border-border">
                            <h3 className="text-lg font-semibold">Chat History</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2 gap-2"
                                onClick={handleNewChat}
                            >
                                <Plus className="h-4 w-4" />
                                New Chat
                            </Button>
                        </div>
                        <ScrollArea className="h-[calc(100vh-120px)]">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-20">
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
                                            className={`flex items-start justify-between p-2 rounded-md cursor-pointer hover:bg-muted group ${
                                                selectedChatId === chat.id ? 'bg-muted' : ''
                                            }`}
                                            onClick={() => setSelectedChatId(chat.id)}
                                        >
                                            <div className="flex items-start space-x-2 overflow-hidden">
                                                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium truncate">{chat.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(chat.updated_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                            >
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1">
                        <AiChat
                            projects={projects}
                            chatHistoryId={selectedChatId}
                            onChatSaved={loadChatHistories}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
