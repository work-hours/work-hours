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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    type StoredMessage = {
        id: string
        content: string
        isUser: boolean
        timestamp: string
    }

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
            const context = {
                projects,
                messages,
            }

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

            if (!currentChatId && responseData.chat_history_id) {
                setCurrentChatId(responseData.chat_history_id)
            }

            if (onChatSaved) {
                onChatSaved()
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setError('Sorry, I encountered an error. Please try again.')

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again later.',
                isUser: false,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)

            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value)

        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
        }
    }

    return (
        <div
            className="mx-auto flex h-full w-full max-w-2xl flex-col border border-neutral-200 bg-white shadow-lg"
            role="region"
            aria-label="AI chat window"
            tabIndex={0}
            style={{ minHeight: 0 }}
        >
            <div className="flex items-center justify-between border-b border-neutral-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-50 text-primary">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-lg font-medium text-slate-800">AI Assistant</span>
                        <p className="text-xs text-slate-500">Powered by Google Gemini</p>
                    </div>
                </div>
                {onClose && (
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close chat"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex flex-grow flex-col overflow-hidden">
                <ScrollArea className="max-h-[60vh] flex-grow overflow-y-auto bg-slate-50/50 p-4 sm:max-h-[80vh]">
                    <div className="flex flex-col gap-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex items-end ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                                {/* Avatar */}
                                {!message.isUser && (
                                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-primary">
                                        <BrainCircuit className="h-4 w-4" />
                                    </div>
                                )}
                                <div className="flex max-w-[85%] flex-col">
                                    <div
                                        className={`rounded-lg px-4 py-2 shadow-sm ${
                                            message.isUser
                                                ? 'ml-auto bg-primary text-white'
                                                : 'border border-slate-200 bg-white text-slate-800'
                                        }`}
                                    >
                                        {message.isUser ? (
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        ) : (
                                            <div className="markdown-content text-sm leading-relaxed">
                                                <ReactMarkdown
                                                    components={{
                                                        code({ className, children, ...props }) {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return match ? (
                                                                <SyntaxHighlighter style={atomDark as never} language={match[1]} PreTag="div">
                                                                    {String(children).replace(/\n$/, '')}
                                                                </SyntaxHighlighter>
                                                            ) : (
                                                                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-800" {...props}>
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
                                    <div className="mt-1 pr-2 text-right text-xs text-slate-500">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {/* User Avatar */}
                                {message.isUser && (
                                    <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-primary shadow-sm">
                                        <span className="text-sm font-medium">U</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mt-2 flex items-center gap-2 px-2">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" style={{ animationDelay: '100ms' }} />
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" style={{ animationDelay: '200ms' }} />
                                <span className="ml-1 text-xs text-slate-500">AI is thinking...</span>
                            </div>
                        )}
                        {error && (
                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-xs text-red-600">
                                <span>{error}</span>
                                <Button variant="outline" onClick={handleSendMessage} disabled={isLoading} className="h-6 px-2 py-0 text-xs">
                                    Retry
                                </Button>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <div className="flex items-center gap-2 border-t border-neutral-200 bg-white p-3">
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
                        className="flex-grow resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="Type your message here..."
                        aria-label="Type your message"
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="sm"
                        disabled={!inputValue.trim() || isLoading}
                        className="h-9 rounded-md bg-primary px-3 text-white shadow-sm hover:bg-primary/90"
                        aria-label="Send message"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
