import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getChatHistory, sendMessage } from '@actions/AiChatController'
import { BrainCircuit, Loader2, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
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
            content: "Hi! I'm your AI assistant. How can I help you with your time tracking today?",
            isUser: false,
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [currentChatId, setCurrentChatId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Scroll to the bottom of messages when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Define a type for the stored message format
    type StoredMessage = {
        id: string
        content: string
        isUser: boolean
        timestamp: string
    }

    // Load chat history when chatHistoryId changes
    useEffect(() => {
        const loadChatHistory = async () => {
            if (chatHistoryId) {
                try {
                    setIsLoading(true)
                    const response = await getChatHistory.call({
                        params: { id: chatHistoryId },
                    })

                    if (response && response.ok) {
                        const data = await response.json()
                        if (data.success && data.history) {
                            // Convert stored messages to the format expected by the component
                            const historyMessages = data.history.messages.map((msg: StoredMessage) => ({
                                id: msg.id,
                                content: msg.content,
                                isUser: msg.isUser,
                                timestamp: new Date(msg.timestamp),
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
                        content: "Hi! I'm your AI assistant. How can I help you with your time tracking today?",
                        isUser: false,
                        timestamp: new Date(),
                    },
                ])
                setCurrentChatId(null)
            }
        }

        loadChatHistory()
    }, [chatHistoryId])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return
        setError(null)

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
                messages,
            }

            // Send message to backend
            const response = await sendMessage.call({
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
            setError('Sorry, I encountered an error. Please try again.')

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

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
        // Auto-resize logic: adjust textarea height based on content
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
        }
    }

    return (
        <div
            className="mx-auto flex h-full w-full max-w-2xl flex-col border border-border bg-gradient-to-br from-background via-white to-slate-100/80 shadow-2xl"
            role="region"
            aria-label="AI chat window"
            tabIndex={0}
            style={{ minHeight: 0 }}
        >
            <div className="flex items-center justify-between border-b bg-white/80 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40 shadow">
                        <BrainCircuit className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <span className="text-xl font-extrabold tracking-tight text-foreground">AI Assistant</span>
                        <p className="text-xs font-medium text-muted-foreground">Powered by Google Gemini</p>
                    </div>
                </div>
                {onClose && (
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-1 transition-colors hover:bg-muted/60 hover:text-primary"
                        aria-label="Close chat"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>
            <div className="flex flex-grow flex-col overflow-hidden">
                <ScrollArea className="max-h-[60vh] flex-grow overflow-y-auto bg-transparent p-6 sm:max-h-[80vh]">
                    <div className="flex flex-col gap-6">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex items-end ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                                {/* Avatar */}
                                {!message.isUser && (
                                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/40 shadow">
                                        <BrainCircuit className="h-5 w-5 text-primary" />
                                    </div>
                                )}
                                <div className="flex max-w-[80%] flex-col">
                                    <div
                                        className={`rounded-2xl px-5 py-3 shadow-md transition-all duration-200 ${
                                            message.isUser
                                                ? 'ml-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                                                : 'rounded-2xl border border-border bg-white text-card-foreground'
                                        }`}
                                    >
                                        {message.isUser ? (
                                            <p className="text-base leading-relaxed font-semibold">{message.content}</p>
                                        ) : (
                                            <div className="markdown-content text-base leading-relaxed">
                                                <ReactMarkdown
                                                    components={{
                                                        code({ className, children, ...props }) {
                                                            const match = /language-(\\w+)/.exec(className || '')
                                                            return match ? (
                                                                <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                                                                    {String(children).replace(/\\n$/, '')}
                                                                </SyntaxHighlighter>
                                                            ) : (
                                                                <code className={className} {...props}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        },
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                    {/* Timestamp */}
                                    <div className="mt-1 pr-2 text-right text-xs text-muted-foreground">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {/* User Avatar */}
                                {message.isUser && (
                                    <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-bold text-primary-foreground shadow">
                                        <span className="text-lg">U</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mt-2 flex animate-pulse items-center gap-2">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: '0ms' }} />
                                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: '100ms' }} />
                                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/20" style={{ animationDelay: '200ms' }} />
                                <span className="ml-2 text-xs text-muted-foreground">AI is typing…</span>
                            </div>
                        )}
                        {error && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-destructive">
                                <span>{error}</span>
                                <Button variant="outline" onClick={handleSendMessage} disabled={isLoading} className="h-7 px-2 py-1 text-xs">
                                    Retry
                                </Button>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <div className="flex items-center gap-3 border-t bg-white/80 p-5 shadow-inner">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage().then()
                            }
                        }}
                        rows={1}
                        className="flex-grow resize-none border border-border bg-white px-4 py-3 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
                        placeholder="Type your message here..."
                        aria-label="Type your message"
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        disabled={!inputValue.trim() || isLoading}
                        className="flex h-12 w-12 items-center justify-center bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-primary/90"
                        aria-label="Send message"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
