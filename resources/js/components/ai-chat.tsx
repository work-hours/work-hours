import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BrainCircuit, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { sendMessage } from '@actions/AiChatController'

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

export default function AiChat({ onClose, projects = [] }: AiChatProps) {
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
            }

            // Send message to backend
            const response = await sendMessage
                .call({
                    data: {
                        message: userMessage.content,
                        context,
                    },
                })

            if (!response || !response.ok) {
                throw new Error('Invalid response from server')
            }

            const responseData = await response.json()

            if (!responseData.success) {
                throw new Error(responseData.message || 'Failed to get response from AI')
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: responseData.message,
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
        <div className="fixed right-4 bottom-4 z-50 w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
            <Card className="overflow-hidden rounded-2xl border border-primary/20 shadow-xl shadow-primary/5 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center justify-between bg-gradient-to-r from-primary/15 to-primary/5 p-4 dark:from-primary/20 dark:to-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg font-bold text-primary/90">Ask AI Assistant</span>
                    </div>
                    <Button onClick={onClose} variant="ghost" size="sm" className="h-8 w-8 p-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
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
                                        className={`max-w-[80%] rounded-lg p-3 shadow-sm animate-in ${message.isUser ? 'slide-in-from-right' : 'slide-in-from-left'} duration-200 ${
                                            message.isUser
                                                ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground'
                                                : 'bg-gradient-to-br from-muted/90 to-muted text-muted-foreground border border-muted/20'
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
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
                                <div className="flex justify-start animate-in fade-in duration-200">
                                    <div className="max-w-[80%] rounded-lg bg-gradient-to-br from-muted/90 to-muted p-3 text-muted-foreground border border-muted/20 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-3 w-3 animate-pulse rounded-full bg-primary/80"></div>
                                            <div className="h-3 w-3 animate-pulse rounded-full bg-primary/80" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="h-3 w-3 animate-pulse rounded-full bg-primary/80" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                    <div className="flex items-center gap-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 dark:border-gray-700 dark:from-gray-900 dark:to-gray-950">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 rounded-full border-primary/20 bg-white px-4 py-2 shadow-sm focus-visible:ring-primary/30 dark:bg-gray-900"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSendMessage}
                            size="icon"
                            disabled={!inputValue.trim() || isLoading}
                            className="h-10 w-10 rounded-full bg-primary/90 shadow-md hover:bg-primary hover:shadow-lg transition-all duration-200"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
