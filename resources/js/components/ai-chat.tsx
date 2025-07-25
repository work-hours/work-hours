import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BrainCircuit, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { sendMessage, getChatHistory } from '@actions/AiChatController'
import '../../css/markdown.css'

type Message = {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
}

type AiChatProps = {
    onClose?: () => void
    projects?: Array<{ id: number; name: string }>
    timeLogs?: Array<{
        id: number
        project_name: string
        duration: number
        note: string
    }>
    chatHistoryId?: number | null
    onChatSaved?: () => void
}

export default function AiChat({ onClose, projects = [], chatHistoryId = null, onChatSaved }: AiChatProps) {
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
    const [currentChatId, setCurrentChatId] = useState<number | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Scroll to the bottom of messages when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Define a type for the stored message format
    type StoredMessage = {
        id: string;
        content: string;
        isUser: boolean;
        timestamp: string;
    }

    // Load chat history when chatHistoryId changes
    useEffect(() => {
        const loadChatHistory = async () => {
            if (chatHistoryId) {
                try {
                    setIsLoading(true)
                    const response = await getChatHistory.call({
                        params: { id: chatHistoryId }
                    })

                    if (response && response.ok) {
                        const data = await response.json()
                        if (data.success && data.history) {
                            // Convert stored messages to the format expected by the component
                            const historyMessages = data.history.messages.map((msg: StoredMessage) => ({
                                id: msg.id,
                                content: msg.content,
                                isUser: msg.isUser,
                                timestamp: new Date(msg.timestamp)
                            }))

                            setMessages(historyMessages)
                            setCurrentChatId(chatHistoryId)
                        }
                    }
                } catch (error) {
                    console.error('Error loading chat history:', error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                // Reset to initial state for a new chat
                setMessages([
                    {
                        id: '1',
                        content: 'Hi! I\'m your AI assistant. How can I help you with your time tracking today?',
                        isUser: false,
                        timestamp: new Date(),
                    }
                ])
                setCurrentChatId(null)
            }
        }

        loadChatHistory()
    }, [chatHistoryId])

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
                messages
            }

            // Send message to backend
            const response = await sendMessage
                .call({
                    data: {
                        message: userMessage.content,
                        context,
                        chat_history_id: currentChatId,
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

            // Update the current chat ID if this is a new chat
            if (!currentChatId && responseData.chat_history_id) {
                setCurrentChatId(responseData.chat_history_id)
            }

            // Notify parent component that a chat was saved or updated
            if (onChatSaved) {
                onChatSaved()
            }
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
            // Focus the input field after response is received
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage().then()
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-card p-4 border-b shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shadow-sm">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-foreground">AI Assistant</span>
                        <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
                    </div>
                </div>
                {onClose && (
                    <Button onClick={onClose} variant="ghost" size="sm" className="h-8 w-8 p-1 rounded-full hover:bg-muted hover:text-primary transition-colors">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex-grow flex flex-col overflow-hidden">
                <ScrollArea className="flex-grow p-4 bg-background">
                    <div className="flex flex-col gap-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-4 shadow-sm animate-in ${message.isUser ? 'slide-in-from-right' : 'slide-in-from-left'} duration-200 ${
                                        message.isUser
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-card text-card-foreground border border-border'
                                    }`}
                                >
                                    {message.isUser ? (
                                        <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                                    ) : (
                                        <div className="markdown-content text-sm leading-relaxed">
                                            <ReactMarkdown
                                                components={{
                                                    code({inline, className, children, ...props}) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                style={atomDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                    <p className="mt-2 text-right text-xs opacity-70 font-medium">
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
                                <div className="max-w-[85%] rounded-lg bg-card p-4 text-card-foreground border border-border shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-16 rounded-full bg-muted-foreground/30"></div>
                                        <div className="h-2 w-10 rounded-full bg-muted-foreground/20"></div>
                                        <div className="h-2 w-6 rounded-full bg-muted-foreground/10"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <div className="flex items-center gap-3 border-t bg-card/50 p-4 shadow-sm">
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 rounded-full border-border bg-background px-4 py-2 shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/20"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        disabled={!inputValue.trim() || isLoading}
                        className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
