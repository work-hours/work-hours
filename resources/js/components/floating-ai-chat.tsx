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

export default function FloatingAiChat({ projects = [] }: FloatingAiChatProps) {
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
                        className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-red-500/5 border-4 border-red-800/40 shadow-xl shadow-red-500/10 hover:shadow-2xl hover:scale-105 hover:border-red-800/60 transition-all duration-300 rotate-3"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <BrainCircuit className="h-7 w-7 text-red-800 animate-float" />
                            <span className="text-xs font-bold text-red-800">Ask AI</span>
                        </div>
                    </Button>
                </div>
            )}
        </>
    )
}
