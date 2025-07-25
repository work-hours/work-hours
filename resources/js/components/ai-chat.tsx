import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BrainCircuit, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Message = {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
}

type AiChatProps = {
    onClose: () => void
    projects?: Array<{ id: number; name: string }>
    timeLogs?: Array<{
        id: number
        project_name: string
        duration: number
        note: string
    }>
}

export default function AiChat({ onClose, projects = [], timeLogs = [] }: AiChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hi! I\'m your AI assistant. How can I help you with your time tracking today?',
            isUser: false,
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to the bottom of messages when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            isUser: true,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            // Prepare context data
            const context = {
                projects,
                timeLogs,
            }

            // Send message to backend
            const response = await fetch(route('ai-chat.send-message'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    context,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.message || 'Failed to get response from AI')
            }

            // Add AI response to messages
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: data.message,
                isUser: false,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error('Error sending message:', error)

            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again later.',
                isUser: false,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage()
        }
    }

    return (
        <div className="fixed right-4 bottom-4 z-50 w-full max-w-md">
            <Card className="overflow-hidden rounded-2xl shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between border-b border-gray-200 bg-primary/10 p-3 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        <span className="font-bold">Ask AI Assistant</span>
                    </div>
                    <Button onClick={onClose} variant="ghost" size="sm" className="h-8 w-8 p-1">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <CardContent className="p-0">
                    <ScrollArea className="h-[400px] p-4">
                        <div className="flex flex-col gap-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                            message.isUser
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <p className="mt-1 text-right text-xs opacity-70">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-muted p-3 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                    <div className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSendMessage}
                            size="icon"
                            disabled={!inputValue.trim() || isLoading}
                            className="h-10 w-10"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
