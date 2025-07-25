import { Button } from '@/components/ui/button'
import AiChat from '@/components/ai-chat'
import { BrainCircuit } from 'lucide-react'
import { useState } from 'react'

type FloatingAiChatProps = {
    projects?: Array<{ id: number; name: string }>
    timeLogs?: Array<{
        id: number
        project_name: string
        duration: number
        note: string
    }>
}

export default function FloatingAiChat({ projects = [], timeLogs = [] }: FloatingAiChatProps) {
    const [isAiChatVisible, setIsAiChatVisible] = useState(false)

    return (
        <>
            {isAiChatVisible ? (
                <AiChat
                    onClose={() => {
                        setIsAiChatVisible(false)
                    }}
                    projects={projects}
                />
            ) : (
                <div className="fixed right-4 bottom-24 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                    <Button
                        onClick={() => {
                            setIsAiChatVisible(true)
                        }}
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-primary/5 border border-primary/20 shadow-xl shadow-primary/10 hover:shadow-2xl hover:scale-105 hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <div className="absolute inset-0 rounded-full animate-pulse-slow bg-primary/5 scale-90"></div>
                            <BrainCircuit className="h-7 w-7 text-primary animate-float" />
                            <span className="text-xs font-bold text-primary">Ask AI</span>
                        </div>
                    </Button>
                </div>
            )}
        </>
    )
}
