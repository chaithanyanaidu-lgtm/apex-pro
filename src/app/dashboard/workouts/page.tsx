'use client'

import { useState, useEffect } from 'react'
import { generateWorkoutSession, swapExercise, getPersonalizedSplit } from '@/lib/workout-engine'
import { getWeeklySchedule, getWorkoutForDay, EXERCISE_DETAILS, ExerciseDetail } from '@/lib/workout-schedule'
import ExerciseDetailModal from '@/components/dashboard/ExerciseDetailModal'
import {
    Dumbbell,
    Flame,
    Target,
    ChevronDown,
    ChevronRight,
    Play,
    RotateCcw,
    AlertCircle,
    CheckCircle2,
    Timer,
    Check,
    X,
    Info
} from 'lucide-react'

export default function WorkoutsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [workout, setWorkout] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay())
    const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail | null>(null)
    const [workoutStarted, setWorkoutStarted] = useState(false)
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
    const [elapsedTime, setElapsedTime] = useState(0)
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem('apex_athlete_profile')
        let data: any = null
        if (saved) {
            try {
                data = JSON.parse(saved)
            } catch (e) {
                console.error("Error loading profile", e)
            }
        }
        const mappedProfile = {
            full_name: data?.name || 'ATHLETE',
            goal: (data?.goal || 'Muscle Gain').toLowerCase().replace(' ', '_'),
            level: (data?.level || 'Intermediate').toLowerCase(),
            equipment: (data?.equipment || 'Full Gym').toLowerCase().replace(' ', '_')
        }
        setProfile(mappedProfile)
        setLoading(false)
    }, [])

    // Generate workout when profile or selected day changes
    useEffect(() => {
        if (profile) {
            const session = getWorkoutForDay(selectedDay, profile.goal, profile.level, profile.equipment)
            setWorkout(session)
            setCompletedExercises(new Set())
            setWorkoutStarted(false)
            if (timerInterval) clearInterval(timerInterval)
            setElapsedTime(0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile, selectedDay])

    const schedule = profile ? getWeeklySchedule(profile.level) : []
    const todayIndex = new Date().getDay()

    const handleSwapExercise = (exerciseName: string, index: number) => {
        if (!profile || !workout) return
        const newEx = swapExercise(exerciseName, profile.equipment)
        if (newEx) {
            const updated = { ...workout }
            updated.exercises = [...updated.exercises]
            updated.exercises[index] = newEx
            setWorkout(updated)
        }
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
            next.has(name) ? next.delete(name) : next.add(name)
            return next
        })
    }

    const finishWorkout = () => {
        if (timerInterval) clearInterval(timerInterval)
        setWorkoutStarted(false)
        // Mark workout completed in localStorage
        const today = new Date().toISOString().split('T')[0]
        const scoreKey = `apex_daily_score_${today}`
        try {
            const existing = JSON.parse(localStorage.getItem(scoreKey) || '{}')
            existing.workout_completed = true
            existing.stretching_completed = true
            localStorage.setItem(scoreKey, JSON.stringify(existing))
        } catch { /* ignore */ }
        // Update streak
        try {
            const streak = JSON.parse(localStorage.getItem('apex_streak') || '{"user_id":"local","current_streak":0,"longest_streak":0,"last_active_date":"","updated_at":""}')
            const lastDate = streak.last_active_date
            const diffDays = lastDate ? Math.ceil(Math.abs(new Date(today).getTime() - new Date(lastDate).getTime()) / 86400000) : 2
            if (diffDays <= 1) streak.current_streak += 1
            else streak.current_streak = 1
            if (streak.current_streak > streak.longest_streak) streak.longest_streak = streak.current_streak
            streak.last_active_date = today
            streak.updated_at = new Date().toISOString()
            localStorage.setItem('apex_streak', JSON.stringify(streak))
        } catch { /* ignore */ }
        // Update badges
        try {
            const badges = JSON.parse(localStorage.getItem('apex_badges') || '[]')
            const firstWorkout = badges.find((b: any) => b.id === 'first_workout')
            if (firstWorkout && !firstWorkout.earned) {
                firstWorkout.earned = true
                firstWorkout.earnedDate = new Date().toISOString()
            }
            localStorage.setItem('apex_badges', JSON.stringify(badges))
        } catch { /* ignore */ }
        alert('🎉 WORKOUT COMPLETED! Score and streak updated.')
    }

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-apex-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    const selectedDayInfo = schedule.find(d => d.dayIndex === selectedDay)
    const isRestDay = selectedDayInfo?.focus === 'rest'

    return (
        <div className="space-y-8 animate-fade-up">
            <header className="flex justify-between items-start">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
                        ATHLETE TRAINING SYSTEM
                    </div>
                    <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                        WORKOUT <em className="text-apex-accent not-italic">FORGE</em>
                    </h1>
                    {profile && (
                        <p className="text-[0.7rem] font-mono text-apex-muted mt-1">
                            {profile.level.toUpperCase()} • {profile.goal.replace('_', ' ').toUpperCase()} • {profile.equipment.replace('_', ' ').toUpperCase()}
                        </p>
                    )}
                </div>
                {!isRestDay && workout && (
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
                                className="bg-apex-accent text-bg px-6 py-2.5 text-xs font-bold tracking-[2px] uppercase transition-all hover:bg-[#e0ff33] flex items-center gap-2 cursor-pointer"
                            >
                                <Play className="w-4 h-4" /> START SESSION
                            </button>
                        ) : (
                            <div className="flex gap-1.5">
                                <button onClick={cancelWorkout} className="flex items-center gap-1.5 bg-surface border border-border-main text-apex-muted px-3 py-2 text-[0.65rem] font-bold uppercase hover:text-apex-danger hover:border-apex-danger/50 transition-colors cursor-pointer">
                                    <X className="w-3 h-3" /> CANCEL
                                </button>
                                <button onClick={finishWorkout} className="flex items-center gap-1.5 bg-green-500 text-bg px-4 py-2 text-[0.65rem] font-bold uppercase hover:bg-green-400 transition-colors cursor-pointer">
                                    <Check className="w-3.5 h-3.5" /> FINISH
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Current Workout Card */}
                    <div className="bg-card border border-border-main overflow-hidden">
                        <div className="p-7 border-b border-border-main">
                            {isRestDay ? (
                                <div className="text-center py-8">
                                    <div className="text-[2.5rem] mb-2">🧘</div>
                                    <div className="font-display text-xl text-apex-accent">{selectedDayInfo?.label}</div>
                                    <p className="text-[0.8rem] text-apex-muted font-mono mt-2">REST DAY — RECOVER AND RECHARGE</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="font-display text-2xl tracking-[1px] uppercase">{workout?.name || 'LOADING...'}</h2>
                                            <p className="text-apex-muted text-xs font-mono uppercase tracking-[1px] mt-1">
                                                {selectedDayInfo?.label} • {workout?.exercises?.length || 0} EXERCISES
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    {workoutStarted && workout && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-[0.65rem] font-mono text-apex-muted mb-1">
                                                <span>PROGRESS</span>
                                                <span>{completedExercises.size}/{workout.exercises.length} DONE</span>
                                            </div>
                                            <div className="h-1 bg-surface overflow-hidden">
                                                <div className="h-full bg-apex-accent transition-all duration-500" style={{ width: `${(completedExercises.size / workout.exercises.length) * 100}%` }} />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {!isRestDay && workout && (
                            <div className="divide-y divide-border-main">
                                {workout.exercises.map((ex: any, i: number) => {
                                    const detail = EXERCISE_DETAILS[ex.name]
                                    const isCompleted = completedExercises.has(ex.name)
                                    return (
                                        <div key={i} className={`p-6 group hover:bg-white/[0.01] transition-colors ${isCompleted ? 'bg-green-500/5' : ''}`}>
                                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        {workoutStarted && (
                                                            <button
                                                                onClick={() => toggleExercise(ex.name)}
                                                                className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 cursor-pointer ${isCompleted ? 'bg-green-500 border-green-500' : 'border-border-sub hover:border-apex-accent'}`}
                                                            >
                                                                {isCompleted && <Check className="w-3 h-3 text-bg" />}
                                                            </button>
                                                        )}
                                                        <span className="w-6 h-6 rounded-full bg-surface border border-border-main flex items-center justify-center text-[0.65rem] font-mono text-apex-accent">
                                                            {i + 1}
                                                        </span>
                                                        <h3 className={`font-display text-xl tracking-[0.5px] uppercase ${isCompleted ? 'line-through text-apex-muted' : ''}`}>{ex.name}</h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 mt-3 ml-9">
                                                        <div className="px-3 py-1 bg-surface border border-border-main rounded text-[0.65rem] font-mono whitespace-nowrap">
                                                            <span className="text-apex-muted">SETS:</span> {ex.sets}
                                                        </div>
                                                        <div className="px-3 py-1 bg-surface border border-border-main rounded text-[0.65rem] font-mono whitespace-nowrap">
                                                            <span className="text-apex-muted">REPS:</span> {ex.reps}
                                                        </div>
                                                        <div className="px-3 py-1 bg-surface border border-border-main rounded text-[0.65rem] font-mono whitespace-nowrap">
                                                            <span className="text-apex-muted">REST:</span> {ex.rest}
                                                        </div>
                                                    </div>

                                                    {/* Variations */}
                                                    {detail && detail.variations.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-3 ml-9">
                                                            {detail.variations.map((v, vi) => (
                                                                <button
                                                                    key={vi}
                                                                    onClick={() => setSelectedExercise(detail)}
                                                                    className="text-[0.6rem] font-mono px-2 py-1 bg-card border border-border-main text-apex-muted hover:text-apex-accent hover:border-apex-accent/30 transition-colors cursor-pointer"
                                                                >
                                                                    {v.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSwapExercise(ex.name, i)}
                                                        className="p-2.5 border border-border-main bg-surface text-apex-muted hover:text-apex-accent hover:border-apex-accent transition-all cursor-pointer"
                                                        title="Swap Exercise"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                    {detail && (
                                                        <button
                                                            onClick={() => setSelectedExercise(detail)}
                                                            className="p-2.5 border border-border-main bg-surface text-apex-muted hover:text-apex-accent hover:border-apex-accent transition-all cursor-pointer"
                                                            title="Exercise Details"
                                                        >
                                                            <Info className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* APEX RULES */}
                    <div className="bg-surface border border-border-main p-7">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-apex-accent" />
                            <h3 className="font-display text-lg tracking-[1px] uppercase">APEX RULES</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                                    <strong className="text-apex-text uppercase">Progressive Overload:</strong> Increase weight by 2.5kg if you hit all target reps in the final set.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                                    <strong className="text-apex-text uppercase">Rep Intensity:</strong> Heavy compounds (6–8 reps), moderate exercises (10–12 reps), isolation moves (12–15 reps).
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                                    <strong className="text-apex-text uppercase">Form Priority:</strong> Depth over weight. Reset if form breaks down before RPE 9.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                                    <strong className="text-apex-text uppercase">Rest Periods:</strong> 3 min for heavy lifts, 90s for moderate, 60s for isolation.
                                </p>
                            </li>
                        </ul>
                    </div>

                    {/* Rotation Schedule - Clickable */}
                    <div className="bg-card border border-border-main p-7">
                        <h3 className="font-display text-lg tracking-[1px] uppercase mb-5">ROTATION SCHEDULE</h3>
                        <div className="space-y-2">
                            {schedule
                                .sort((a, b) => {
                                    const order = [1, 2, 3, 4, 5, 6, 0]
                                    return order.indexOf(a.dayIndex) - order.indexOf(b.dayIndex)
                                })
                                .map((day) => {
                                    const isToday = day.dayIndex === todayIndex
                                    const isSelected = day.dayIndex === selectedDay
                                    return (
                                        <button
                                            key={day.dayIndex}
                                            onClick={() => setSelectedDay(day.dayIndex)}
                                            className={`w-full flex items-center justify-between p-3 border rounded-sm transition-all cursor-pointer ${isSelected
                                                ? 'bg-apex-accent/10 border-apex-accent/40 text-apex-accent'
                                                : 'bg-surface border-border-main hover:border-border-sub'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[0.65rem] font-mono ${isSelected ? 'text-apex-accent' : 'text-apex-muted'}`}>
                                                    {day.dayName.slice(0, 3).toUpperCase()}
                                                </span>
                                                <span className={`text-[0.8rem] font-semibold ${isSelected ? 'text-apex-accent' : 'text-apex-text'}`}>
                                                    {day.label.toUpperCase()}
                                                </span>
                                                {isToday && (
                                                    <span className="text-[0.5rem] font-mono bg-apex-accent text-bg px-1.5 py-0.5 uppercase">TODAY</span>
                                                )}
                                            </div>
                                            {day.focus === 'rest' ? (
                                                <div className="w-4 h-4 rounded-full border border-border-main" />
                                            ) : isSelected ? (
                                                <Dumbbell className="w-4 h-4 text-apex-accent" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-apex-dim" />
                                            )}
                                        </button>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            </div>

            <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        </div>
    )
}
