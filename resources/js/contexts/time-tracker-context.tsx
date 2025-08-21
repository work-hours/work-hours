import axios from 'axios'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

export type TrackerTask = {
    id: number
    title: string
    project_id: number
    project_name: string
}

export type TimeTrackerState = {
    running: boolean
    paused: boolean
    task: TrackerTask | null
    startEpochMs: number | null
    elapsedMs: number // accumulated elapsed when paused + since start when running
}

export type TimeTrackerContextType = TimeTrackerState & {
    start: (task: TrackerTask) => void
    pause: () => void
    resume: () => void
    stop: () => Promise<void>
    adjustElapsed: (deltaMs: number) => void
    setElapsedExact: (ms: number) => void
}

const TimeTrackerContext = createContext<TimeTrackerContextType | undefined>(undefined)

const STORAGE_KEY = 'running_time_tracker_v1'

function loadState(): TimeTrackerState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { running: false, paused: false, task: null, startEpochMs: null, elapsedMs: 0 }
        const parsed = JSON.parse(raw)
        return {
            running: !!parsed.running,
            paused: !!parsed.paused,
            task: parsed.task ?? null,
            startEpochMs: parsed.startEpochMs ?? null,
            elapsedMs: parsed.elapsedMs ?? 0,
        }
    } catch {
        return { running: false, paused: false, task: null, startEpochMs: null, elapsedMs: 0 }
    }
}

function saveState(state: TimeTrackerState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function TimeTrackerProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<TimeTrackerState>(() =>
        typeof window !== 'undefined' ? loadState() : { running: false, paused: false, task: null, startEpochMs: null, elapsedMs: 0 },
    )
    const tickRef = useRef<number | null>(null)
    const lastTickStart = useRef<number | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            saveState(state)
        }
    }, [state])

    useEffect(() => {
        if (state.running && !state.paused) {
            lastTickStart.current = Date.now()
            tickRef.current = window.setInterval(() => {
                setState((prev) => {
                    if (!prev.running || prev.paused) return prev
                    const now = Date.now()
                    const delta = now - (lastTickStart.current ?? now)
                    lastTickStart.current = now
                    return { ...prev, elapsedMs: prev.elapsedMs + delta }
                })
            }, 1000)
        }
        return () => {
            if (tickRef.current) {
                clearInterval(tickRef.current)
                tickRef.current = null
            }
        }
    }, [state.running, state.paused])

    const originalTitleRef = useRef<string | null>(null)
    useEffect(() => {
        if (typeof document === 'undefined') return

        const formatHMS = (ms: number) => {
            const totalSec = Math.floor(ms / 1000)
            const h = Math.floor(totalSec / 3600)
            const m = Math.floor((totalSec % 3600) / 60)
            const s = totalSec % 60
            const pad = (n: number) => n.toString().padStart(2, '0')
            return `${pad(h)}:${pad(m)}:${pad(s)}`
        }

        if (state.running && state.task) {
            if (!originalTitleRef.current) {
                originalTitleRef.current = document.title
            }
            const timeStr = formatHMS(state.elapsedMs)
            const statusIcon = state.paused ? '⏸' : '⏵'
            const taskTitle = state.task.title
            document.title = `${timeStr} ${statusIcon} ${taskTitle}`
        } else {
            if (originalTitleRef.current) {
                document.title = originalTitleRef.current
                originalTitleRef.current = null
            }
        }
    }, [state.running, state.paused, state.elapsedMs, state.task])

    const start = useCallback((task: TrackerTask) => {
        setState((prev) => {
            if (prev.running) {
                toast.error('A tracker is already running. Please stop it before starting another.')
                return prev
            }
            return { running: true, paused: false, task, startEpochMs: Date.now(), elapsedMs: 0 }
        })
    }, [])

    const pause = useCallback(() => {
        setState((prev) => {
            if (!prev.running || prev.paused) return prev
            return { ...prev, paused: true }
        })
    }, [])

    const resume = useCallback(() => {
        setState((prev) => {
            if (!prev.running || !prev.paused) return prev
            return { ...prev, paused: false }
        })
    }, [])

    const stop = useCallback(async () => {
        const s = state
        if (!s.running || !s.task || !s.startEpochMs) {
            setState({ running: false, paused: false, task: null, startEpochMs: null, elapsedMs: 0 })
            return
        }

        try {
            const startDate = new Date(s.startEpochMs)
            const endDate = new Date(s.startEpochMs + s.elapsedMs)

            const payload: Record<string, unknown> = {
                project_id: s.task.project_id,
                task_id: s.task.id,
                start_timestamp: startDate.toISOString().slice(0, 19).replace('T', ' '),
                end_timestamp: endDate.toISOString().slice(0, 19).replace('T', ' '),
                note: null,
                is_paid: false,
            }

            await axios.post(route('time-log.store'), payload)
            toast.success('Time log created')
        } catch (e) {
            console.error('Failed to create time log', e)
            toast.error('Failed to create time log')
        } finally {
            setState({ running: false, paused: false, task: null, startEpochMs: null, elapsedMs: 0 })
        }
    }, [state])

    const adjustElapsed = useCallback((deltaMs: number) => {
        setState((prev) => {
            if (!prev.running) return prev
            const next = Math.max(0, prev.elapsedMs + deltaMs)
            return { ...prev, elapsedMs: next }
        })
    }, [])

    const setElapsedExact = useCallback((ms: number) => {
        setState((prev) => {
            if (!prev.running) return prev
            const next = Math.max(0, Math.floor(ms))
            return { ...prev, elapsedMs: next }
        })
    }, [])

    const value = useMemo<TimeTrackerContextType>(
        () => ({ ...state, start, pause, resume, stop, adjustElapsed, setElapsedExact }),
        [state, start, pause, resume, stop, adjustElapsed, setElapsedExact],
    )

    return <TimeTrackerContext.Provider value={value}>{children}</TimeTrackerContext.Provider>
}

export function useTimeTracker(): TimeTrackerContextType {
    const ctx = useContext(TimeTrackerContext)
    if (!ctx) throw new Error('useTimeTracker must be used within TimeTrackerProvider')
    return ctx
}
