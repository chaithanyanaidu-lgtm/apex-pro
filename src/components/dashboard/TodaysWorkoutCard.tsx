'use client'

import { useState } from 'react'
import { Dumbbell, ChevronDown, ChevronRight, Play, Check, Timer, X } from 'lucide-react'
import { WorkoutSession } from '@/types/fitness'
import { STRETCHING_BY_GROUP, EXERCISE_DETAILS, ExerciseDetail } from '@/lib/workout-schedule'
import ExerciseDetailModal from './ExerciseDetailModal'

interface TodaysWorkoutCardProps {
    workout: WorkoutSession | null
    muscleGroup: string
    dayLabel: string
    isRestDay: boolean
    onWorkoutComplete: () => void
}

export default function TodaysWorkoutCard({ workout, muscleGroup, dayLabel, isRestDay, onWorkoutComplete }: TodaysWorkoutCardProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ warmup: true, main: true, stretch: false })
    const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail | null>(null)
    const [workoutStarted, setWorkoutStarted] = useState(false)
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
    const [elapsedTime, setElapsedTime] = useState(0)
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

    const stretches = STRETCHING_BY_GROUP[muscleGroup] || STRETCHING_BY_GROUP['full_body']

    const toggleSection = (key: string) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const startWorkout = () => {
        setWorkoutStarted(true)
        setCompletedExercises(new Set())
        setElapsedTime(0)
        const interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000)
        setTimerInterval(interval)
    }

    const cancelWorkout = () => {
        setWorkoutStarted(false)
        setCompletedExercises(new Set())
        setElapsedTime(0)
        if (timerInterval) clearInterval(timerInterval)
    }

    const toggleExercise = (name: string) => {
        if (!workoutStarted) return
        setCompletedExercises(prev => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    const finishWorkout = () => {
        if (timerInterval) clearInterval(timerInterval)
        setWorkoutStarted(false)
        onWorkoutComplete()
    }

    const totalExercises = (workout?.exercises.length || 0) + (workout?.warmup.length || 0) + stretches.length
    const completedCount = completedExercises.size
    const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    const handleExerciseClick = (name: string) => {
        const detail = EXERCISE_DETAILS[name]
        if (detail) setSelectedExercise(detail)
    }

    if (isRestDay) {
        return (
            <div className="bg-card border border-border-main p-7">
                <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase mb-4">TODAY&apos;S WORKOUT</h3>
                <div className="text-center py-12 border border-dashed border-border-main">
                    <div className="text-[2.5rem] mb-2">🧘</div>
                    <div className="font-display text-xl text-apex-accent">{dayLabel}</div>
                    <p className="text-[0.8rem] text-apex-muted mt-2 font-mono">RECOVERY DAY — REST, STRETCH, AND RECHARGE</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-card border border-border-main p-7">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase">TODAY&apos;S WORKOUT</h3>
                        {workout && (
                            <span className="text-[0.6rem] font-mono text-apex-accent tracking-[2px] uppercase mt-1 block">
                                {dayLabel} • {workout.name}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {workoutStarted && (
                            <div className="flex items-center gap-2 mr-2">
                                <Timer className="w-4 h-4 text-apex-accent" />
                                <span className="font-mono text-[0.85rem] text-apex-accent">{formatTime(elapsedTime)}</span>
                            </div>
                        )}
                        {!workoutStarted ? (
                            <button
                                onClick={startWorkout}
                                className="flex items-center gap-2 bg-apex-accent text-bg px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[1px] hover:bg-[#e0ff33] transition-colors cursor-pointer"
                            >
                                <Play className="w-3.5 h-3.5" />
                                START WORKOUT
                            </button>
                        ) : (
                            <div className="flex gap-1.5">
                                <button
                                    onClick={cancelWorkout}
                                    className="flex items-center gap-1.5 bg-surface border border-border-main text-apex-muted px-3 py-2 text-[0.65rem] font-bold uppercase hover:text-apex-danger hover:border-apex-danger/50 transition-colors cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                    CANCEL
                                </button>
                                <button
                                    onClick={finishWorkout}
                                    className="flex items-center gap-1.5 bg-green-500 text-bg px-4 py-2 text-[0.65rem] font-bold uppercase hover:bg-green-400 transition-colors cursor-pointer"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    FINISH
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress bar during workout */}
                {workoutStarted && (
                    <div className="mb-5">
                        <div className="flex justify-between text-[0.65rem] font-mono text-apex-muted mb-1">
                            <span>PROGRESS</span>
                            <span>{completedCount}/{totalExercises} EXERCISES</span>
                        </div>
                        <div className="h-1 bg-surface overflow-hidden">
                            <div className="h-full bg-apex-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}

                {/* Day-of-week indicator */}
                <div className="grid grid-cols-7 gap-1 md:gap-[5px] mb-5">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                        const todayIndex = new Date().getDay()
                        const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1
                        return (
                            <div
                                key={i}
                                className={`text-center py-2 text-[0.6rem] font-mono tracking-[1px] ${i === adjustedIndex ? 'bg-apex-accent text-bg font-bold' : 'bg-surface text-apex-dim'
                                    }`}
                            >
                                {day}
                            </div>
                        )
                    })}
                </div>

                {/* Warm-up Section */}
                {workout && workout.warmup.length > 0 && (
                    <div className="mb-3">
                        <button
                            onClick={() => toggleSection('warmup')}
                            className="w-full flex items-center justify-between py-2 text-[0.7rem] font-bold font-mono text-apex-accent uppercase tracking-[2px] cursor-pointer"
                        >
                            <span>🔥 WARM-UP ({workout.warmup.length})</span>
                            {expandedSections.warmup ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {expandedSections.warmup && (
                            <div className="space-y-1.5">
                                {workout.warmup.map((w, i) => (
                                    <div
                                        key={i}
                                        onClick={() => workoutStarted && toggleExercise(`warmup-${i}`)}
                                        className={`flex items-center gap-3 p-3 bg-surface border border-border-main transition-all ${workoutStarted ? 'cursor-pointer hover:border-apex-accent/30' : ''
                                            } ${completedExercises.has(`warmup-${i}`) ? 'border-green-500/30 bg-green-500/5' : ''}`}
                                    >
                                        {workoutStarted && (
                                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${completedExercises.has(`warmup-${i}`) ? 'bg-green-500 border-green-500' : 'border-border-sub'
                                                }`}>
                                                {completedExercises.has(`warmup-${i}`) && <Check className="w-3 h-3 text-bg" />}
                                            </div>
                                        )}
                                        <span className={`text-[0.82rem] ${completedExercises.has(`warmup-${i}`) ? 'line-through text-apex-muted' : ''}`}>{w}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Workout Section */}
                <div className="mb-3">
                    <button
                        onClick={() => toggleSection('main')}
                        className="w-full flex items-center justify-between py-2 text-[0.7rem] font-bold font-mono text-apex-accent uppercase tracking-[2px] cursor-pointer"
                    >
                        <span>💪 MAIN WORKOUT ({workout?.exercises.length || 0})</span>
                        {expandedSections.main ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expandedSections.main && (
                        <div className="space-y-2">
                            {workout?.exercises.map((ex, i) => {
                                const detail = EXERCISE_DETAILS[ex.name]
                                return (
                                    <div key={i} className={`bg-surface border border-border-main transition-all ${completedExercises.has(ex.name) ? 'border-green-500/30 bg-green-500/5' : ''}`}>
                                        <div
                                            className={`flex items-center gap-3.5 p-[13px_15px] ${workoutStarted ? 'cursor-pointer' : ''}`}
                                            onClick={() => workoutStarted && toggleExercise(ex.name)}
                                        >
                                            {workoutStarted && (
                                                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${completedExercises.has(ex.name) ? 'bg-green-500 border-green-500' : 'border-border-sub'
                                                    }`}>
                                                    {completedExercises.has(ex.name) && <Check className="w-3 h-3 text-bg" />}
                                                </div>
                                            )}
                                            <Dumbbell className="w-5 h-5 text-apex-accent flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className={`text-[0.88rem] font-semibold ${completedExercises.has(ex.name) ? 'line-through text-apex-muted' : ''}`}>
                                                    {ex.name}
                                                </div>
                                                <div className="text-[0.72rem] text-apex-muted font-mono mt-0.5">
                                                    {ex.sets} SETS • {ex.reps} REPS • {ex.rest} REST
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {Array.from({ length: ex.sets }).map((_, s) => (
                                                    <div key={s} className={`w-2.5 h-2.5 rounded-full border ${completedExercises.has(ex.name) ? 'bg-green-500 border-green-500' : 'border-border-main bg-transparent'}`} />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Variations */}
                                        {detail && detail.variations.length > 0 && (
                                            <div className="border-t border-border-main/50 px-4 py-2 flex flex-wrap gap-1.5">
                                                {detail.variations.map((v, vi) => (
                                                    <button
                                                        key={vi}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleExerciseClick(ex.name)
                                                        }}
                                                        className="text-[0.65rem] font-mono px-2 py-1 bg-card border border-border-main text-apex-muted hover:text-apex-accent hover:border-apex-accent/30 transition-colors cursor-pointer"
                                                    >
                                                        {v.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            {!workout && (
                                <div className="text-center py-10 border border-dashed border-border-main text-apex-muted text-[0.8rem] font-mono uppercase">
                                    INITIALIZING TRAINING SESSION...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Stretching Section */}
                <div>
                    <button
                        onClick={() => toggleSection('stretch')}
                        className="w-full flex items-center justify-between py-2 text-[0.7rem] font-bold font-mono text-apex-accent uppercase tracking-[2px] cursor-pointer"
                    >
                        <span>🧘 STRETCHING ({stretches.length})</span>
                        {expandedSections.stretch ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expandedSections.stretch && (
                        <div className="space-y-1.5">
                            {stretches.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => workoutStarted && toggleExercise(`stretch-${i}`)}
                                    className={`flex items-center gap-3 p-3 bg-surface border border-border-main transition-all ${workoutStarted ? 'cursor-pointer hover:border-apex-accent/30' : ''
                                        } ${completedExercises.has(`stretch-${i}`) ? 'border-green-500/30 bg-green-500/5' : ''}`}
                                >
                                    {workoutStarted && (
                                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${completedExercises.has(`stretch-${i}`) ? 'bg-green-500 border-green-500' : 'border-border-sub'
                                            }`}>
                                            {completedExercises.has(`stretch-${i}`) && <Check className="w-3 h-3 text-bg" />}
                                        </div>
                                    )}
                                    <span className={`text-[0.82rem] ${completedExercises.has(`stretch-${i}`) ? 'line-through text-apex-muted' : ''}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        </>
    )
}
