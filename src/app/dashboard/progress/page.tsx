'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp,
    Scale,
    Activity,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Flame,
    Target,
    CheckCircle2,
    Dumbbell,
    Utensils,
    Droplets,
    X,
    Save
} from 'lucide-react'
import StreaksBadgesCard from '@/components/dashboard/StreaksBadgesCard'
import { Badge } from '@/types/fitness'

function getLocalJSON<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch { return fallback }
}

function todayKey() { return new Date().toISOString().split('T')[0] }

const DEFAULT_BADGES: Badge[] = [
    { id: 'first_workout', name: 'First Workout', description: 'Complete your first workout', icon: 'trophy', earned: false },
    { id: '7_day_streak', name: '7-Day Streak', description: 'Work out 7 consecutive days', icon: 'flame', earned: false },
    { id: '30_day_streak', name: '30-Day Consistency', description: '30-day workout streak', icon: 'crown', earned: false },
    { id: 'perfect_score', name: '100 Score', description: 'Achieve a perfect daily score', icon: 'zap', earned: false },
]

export default function ProgressPage() {
    const [profile, setProfile] = useState<any>(null)
    const [activities, setActivities] = useState({
        workout_completed: false,
        diet_followed: false,
        water_goal: false,
        steps_goal: false,
        stretching_completed: false,
    })
    const [streak, setStreak] = useState({ current: 0, longest: 0 })
    const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES)
    const [measurements, setMeasurements] = useState<any[]>([])
    const [showMeasurementForm, setShowMeasurementForm] = useState(false)
    const [newWeight, setNewWeight] = useState('')
    const [newBodyFat, setNewBodyFat] = useState('')
    const [weeklyHistory, setWeeklyHistory] = useState<boolean[]>([false, false, false, false, false, false, false])
    const [weeklyDietHistory, setWeeklyDietHistory] = useState<boolean[]>([false, false, false, false, false, false, false])

    useEffect(() => {
        // Load profile
        const saved = localStorage.getItem('apex_athlete_profile')
        if (saved) {
            try { setProfile(JSON.parse(saved)) } catch { /* ignore */ }
        }

        // Load today's activities
        const scoreKey = `apex_daily_score_${todayKey()}`
        const savedActivities = getLocalJSON(scoreKey, activities)
        setActivities(savedActivities)

        // Load streak
        const savedStreak = getLocalJSON('apex_streak', { current_streak: 0, longest_streak: 0 })
        setStreak({ current: savedStreak.current_streak, longest: savedStreak.longest_streak })

        // Load badges
        setBadges(getLocalJSON<Badge[]>('apex_badges', DEFAULT_BADGES))

        // Load measurements
        setMeasurements(getLocalJSON<any[]>('apex_measurements', []))

        // Build weekly history (past 7 days)
        const workoutWeek: boolean[] = []
        const dietWeek: boolean[] = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const key = d.toISOString().split('T')[0]
            const dayData = getLocalJSON(`apex_daily_score_${key}`, { workout_completed: false, diet_followed: false })
            workoutWeek.push(dayData.workout_completed || false)
            dietWeek.push(dayData.diet_followed || false)
        }
        setWeeklyHistory(workoutWeek)
        setWeeklyDietHistory(dietWeek)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleActivity = (key: keyof typeof activities) => {
        const updated = { ...activities, [key]: !activities[key] }
        setActivities(updated)
        localStorage.setItem(`apex_daily_score_${todayKey()}`, JSON.stringify(updated))
    }

    const saveMeasurement = () => {
        if (!newWeight) return
        const entry = {
            date: todayKey(),
            weight: parseFloat(newWeight),
            bodyFat: newBodyFat ? parseFloat(newBodyFat) : null,
        }
        const updated = [...measurements, entry]
        setMeasurements(updated)
        localStorage.setItem('apex_measurements', JSON.stringify(updated))
        setNewWeight('')
        setNewBodyFat('')
        setShowMeasurementForm(false)
    }

    // Compute stats
    const currentWeight = profile?.weight || (measurements.length > 0 ? measurements[measurements.length - 1].weight : '--')
    const previousWeight = measurements.length > 1 ? measurements[measurements.length - 2].weight : null
    const weightChange = previousWeight ? (currentWeight - previousWeight).toFixed(1) : null
    const dailyScore = Object.values(activities).filter(Boolean).length * 20
    const workoutCompletionRate = weeklyHistory.filter(Boolean).length
    const dietAdherenceRate = weeklyDietHistory.filter(Boolean).length

    const stats = [
        { label: 'Current Weight', val: `${currentWeight}kg`, change: weightChange ? `${parseFloat(weightChange) > 0 ? '+' : ''}${weightChange}kg` : 'N/A', trend: weightChange ? (parseFloat(weightChange) > 0 ? 'up' : 'down') : 'neutral' },
        { label: 'Daily Score', val: `${dailyScore}`, change: `${dailyScore}/100`, trend: dailyScore >= 60 ? 'up' : 'neutral' },
        { label: 'Workout Streak', val: `${streak.current}`, change: `Longest: ${streak.longest}`, trend: streak.current > 0 ? 'up' : 'neutral' },
        { label: 'This Week', val: `${workoutCompletionRate}/7`, change: `${Math.round((workoutCompletionRate / 7) * 100)}%`, trend: workoutCompletionRate >= 4 ? 'up' : 'neutral' },
    ]

    const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayLabels: string[] = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dayLabels.push(DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1])
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <header className="flex justify-between items-end">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
                        BIOMETRIC TRACKING
                    </div>
                    <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                        PROGRESS <em className="text-apex-accent not-italic">ANALYTICS</em>
                    </h1>
                </div>
                <button
                    onClick={() => setShowMeasurementForm(true)}
                    className="bg-apex-accent text-bg px-6 py-3 text-xs font-bold tracking-[2px] uppercase flex items-center gap-2 hover:bg-[#e0ff33] transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> NEW MEASUREMENT
                </button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-card border border-border-main p-6 group relative overflow-hidden">
                        <div className="text-[0.6rem] font-mono text-apex-muted tracking-[1px] uppercase mb-2">
                            {s.label}
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="font-display text-3xl text-apex-text leading-none">{s.val}</div>
                            <div className={`flex items-center text-[0.7rem] font-bold ${s.trend === 'up' ? 'text-green-400' : s.trend === 'down' ? 'text-apex-danger' : 'text-apex-muted'}`}>
                                {s.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : s.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                                {s.change}
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apex-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </div>
                ))}
            </div>

            {/* Weekly Completion Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border-main p-7">
                    <div className="flex items-center gap-2 mb-5">
                        <Dumbbell className="w-5 h-5 text-apex-accent" />
                        <h3 className="font-display text-xl tracking-[1px] uppercase">WEEKLY WORKOUTS</h3>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                        {weeklyHistory.map((done, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className={`w-full rounded-t transition-all ${done ? 'bg-apex-accent' : 'bg-surface border border-border-main'}`}
                                    style={{ height: done ? '100%' : '30%' }} />
                                <span className="text-[0.55rem] font-mono text-apex-dim">{dayLabels[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-[0.7rem] font-mono text-apex-muted">
                        {workoutCompletionRate}/7 days completed ({Math.round((workoutCompletionRate / 7) * 100)}%)
                    </div>
                </div>

                <div className="bg-card border border-border-main p-7">
                    <div className="flex items-center gap-2 mb-5">
                        <Utensils className="w-5 h-5 text-apex-accent" />
                        <h3 className="font-display text-xl tracking-[1px] uppercase">DIET ADHERENCE</h3>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                        {weeklyDietHistory.map((done, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className={`w-full rounded-t transition-all ${done ? 'bg-green-500' : 'bg-surface border border-border-main'}`}
                                    style={{ height: done ? '100%' : '30%' }} />
                                <span className="text-[0.55rem] font-mono text-apex-dim">{dayLabels[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-[0.7rem] font-mono text-apex-muted">
                        {dietAdherenceRate}/7 days followed ({Math.round((dietAdherenceRate / 7) * 100)}%)
                    </div>
                </div>
            </div>

            {/* Activity Logger */}
            <div className="bg-card border border-border-main p-7">
                <div className="flex items-center gap-2 mb-5">
                    <Target className="w-5 h-5 text-apex-accent" />
                    <h3 className="font-display text-xl tracking-[1px] uppercase">TODAY&apos;S ACTIVITY LOG</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                        { key: 'workout_completed', label: 'Workout', icon: <Dumbbell className="w-4 h-4" />, pts: '+40' },
                        { key: 'diet_followed', label: 'Diet Followed', icon: <Utensils className="w-4 h-4" />, pts: '+30' },
                        { key: 'water_goal', label: 'Water Goal', icon: <Droplets className="w-4 h-4" />, pts: '+10' },
                        { key: 'stretching_completed', label: 'Stretching', icon: <Activity className="w-4 h-4" />, pts: '+10' },
                        { key: 'steps_goal', label: 'Steps Goal', icon: <TrendingUp className="w-4 h-4" />, pts: '+10' },
                    ].map((item) => {
                        const done = activities[item.key as keyof typeof activities]
                        return (
                            <button
                                key={item.key}
                                onClick={() => toggleActivity(item.key as keyof typeof activities)}
                                className={`p-4 border transition-all cursor-pointer flex flex-col items-center gap-2 ${done
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                    : 'bg-surface border-border-main text-apex-muted hover:border-apex-accent/30 hover:text-apex-accent'
                                    }`}
                            >
                                {done ? <CheckCircle2 className="w-5 h-5" /> : item.icon}
                                <span className="text-[0.7rem] font-mono uppercase tracking-[1px]">{item.label}</span>
                                <span className="text-[0.6rem] font-mono">{item.pts}</span>
                            </button>
                        )
                    })}
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-[0.7rem] font-mono text-apex-muted">
                        TODAY&apos;S SCORE: <span className="text-apex-accent font-bold">{dailyScore}/100</span>
                    </div>
                    <div className="h-1.5 flex-1 mx-4 bg-surface overflow-hidden">
                        <div className="h-full bg-apex-accent transition-all duration-500" style={{ width: `${dailyScore}%` }} />
                    </div>
                </div>
            </div>

            {/* Streaks & Badges */}
            <StreaksBadgesCard currentStreak={streak.current} longestStreak={streak.longest} badges={badges} />

            {/* Weight History */}
            {measurements.length > 0 && (
                <div className="bg-card border border-border-main p-7">
                    <div className="flex items-center gap-2 mb-5">
                        <Scale className="w-5 h-5 text-apex-accent" />
                        <h3 className="font-display text-xl tracking-[1px] uppercase">WEIGHT HISTORY</h3>
                    </div>
                    <div className="flex items-end gap-1 h-40">
                        {measurements.slice(-14).map((m, i) => {
                            const minW = Math.min(...measurements.slice(-14).map(x => x.weight))
                            const maxW = Math.max(...measurements.slice(-14).map(x => x.weight))
                            const range = maxW - minW || 1
                            const pct = ((m.weight - minW) / range) * 70 + 30
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[0.6rem] font-mono text-apex-accent bg-bg border border-border-main px-1.5 py-0.5 whitespace-nowrap z-10">
                                        {m.weight}kg
                                    </div>
                                    <div className="w-full bg-apex-accent/30 hover:bg-apex-accent/60 transition-colors rounded-t" style={{ height: `${pct}%` }} />
                                    <span className="text-[0.5rem] font-mono text-apex-dim">{m.date.split('-')[2]}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Measurement Form Modal */}
            {showMeasurementForm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowMeasurementForm(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md bg-card border border-border-main p-7 mx-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display text-xl tracking-[1px] uppercase">NEW MEASUREMENT</h3>
                            <button onClick={() => setShowMeasurementForm(false)} className="w-8 h-8 flex items-center justify-center bg-surface border border-border-main hover:border-apex-accent transition-colors cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">WEIGHT (KG) *</label>
                                <input
                                    type="number"
                                    value={newWeight}
                                    onChange={(e) => setNewWeight(e.target.value)}
                                    placeholder="e.g. 72.5"
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">BODY FAT % (optional)</label>
                                <input
                                    type="number"
                                    value={newBodyFat}
                                    onChange={(e) => setNewBodyFat(e.target.value)}
                                    placeholder="e.g. 15.0"
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <button
                                onClick={saveMeasurement}
                                disabled={!newWeight}
                                className="w-full bg-apex-accent text-bg py-3 text-xs font-bold uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-[#e0ff33] transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Save className="w-4 h-4" /> SAVE MEASUREMENT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
