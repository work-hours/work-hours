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
import { sendMessage } from '@actions/AiChatController'
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
                messages
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
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-gradient-to-r from-primary/20 to-primary/5 p-4 dark:from-primary/30 dark:to-primary/15 border-b border-primary/20">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 shadow-sm">
                        <BrainCircuit className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-primary/90">AI Assistant</span>
                        <p className="text-xs text-primary/70">Powered by Google Gemini</p>
                    </div>
                </div>
                {onClose && (
                    <Button onClick={onClose} variant="ghost" size="sm" className="h-8 w-8 p-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex-grow flex flex-col overflow-hidden">
                <ScrollArea className="flex-grow p-4 bg-gradient-to-b from-background to-muted/30">
                    <div className="flex flex-col gap-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-4 shadow-md animate-in ${message.isUser ? 'slide-in-from-right' : 'slide-in-from-left'} duration-200 ${
                                        message.isUser
                                            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border border-primary/10'
                                            : 'bg-gradient-to-br from-card to-muted/50 text-card-foreground border border-muted/30'
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
                                <div className="max-w-[85%] rounded-lg bg-gradient-to-br from-card to-muted/50 p-4 text-card-foreground border border-muted/30 shadow-md">
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
                <div className="flex items-center gap-3 border-t border-primary/10 bg-gradient-to-r from-primary/5 to-background p-4 dark:from-primary/10 dark:to-background">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 rounded-full border-primary/20 bg-background px-4 py-2 shadow-md focus-visible:ring-primary/40 focus-visible:border-primary/30"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        disabled={!inputValue.trim() || isLoading}
                        className="h-10 w-10 rounded-full bg-primary shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
