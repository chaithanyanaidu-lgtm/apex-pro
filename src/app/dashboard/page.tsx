'use client'

import { useEffect, useState } from 'react'
import { Activity, Flame, Target, TrendingUp, Info } from 'lucide-react'
import Link from 'next/link'
import { getTodaysSchedule, getTodaysWorkoutSession } from '@/lib/workout-schedule'
import { generateWeeklyDiet } from '@/lib/diet-engine'
import { calculateDailyScore, evaluateStreak } from '@/lib/gamification-engine'
import { Badge, WorkoutSession } from '@/types/fitness'
import ProfileDropdown from '@/components/dashboard/ProfileDropdown'
import StreaksBadgesCard from '@/components/dashboard/StreaksBadgesCard'
import TodaysWorkoutCard from '@/components/dashboard/TodaysWorkoutCard'
import TodaysDietCard from '@/components/dashboard/TodaysDietCard'
import DailyScoreCard from '@/components/dashboard/DailyScoreCard'

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
    { id: '7_day_streak', name: '7-Day Streak', description: 'Work out for 7 consecutive days', icon: 'flame', earned: false },
    { id: '30_day_streak', name: '30-Day Consistency', description: 'Maintain a 30-day workout streak', icon: 'crown', earned: false },
    { id: 'perfect_score', name: '100 Score', description: 'Achieve a perfect daily score of 100', icon: 'zap', earned: false },
]

export default function DashboardOverview() {
    const [workout, setWorkout] = useState<WorkoutSession | null>(null)
    const [profile, setProfile] = useState<any>(null)
    const [todayDiet, setTodayDiet] = useState<{ breakfast: string; lunch: string; snack: string; dinner: string; calories: number; protein: number } | null>(null)
    const [dailyScore, setDailyScore] = useState(0)
    const [activities, setActivities] = useState({
        workout_completed: false,
        diet_followed: false,
        water_goal: false,
        steps_goal: false,
        stretching_completed: false,
    })
    const [streak, setStreak] = useState({ current: 0, longest: 0 })
    const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES)
    const [bodyWeight, setBodyWeight] = useState('--')
    const [todaySchedule, setTodaySchedule] = useState<any>(null)

    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })

    useEffect(() => {
        // Load profile
        const saved = localStorage.getItem('apex_athlete_profile')
        let profileData: any = null
        if (saved) {
            try {
                profileData = JSON.parse(saved)
                setProfile(profileData)
                setBodyWeight(profileData.weight || '--')
            } catch (e) {
                console.error("Dashboard profile load error", e)
            }
        }

        // Map profile fields to engine keys
        const level = ((profileData?.level || 'Intermediate').toLowerCase()) as any
        const goal = ((profileData?.goal || 'Muscle Gain').toLowerCase().replace(' ', '_')) as any
        const equipment = ((profileData?.equipment || 'Full Gym').toLowerCase().replace(' ', '_')) as any

        // Get today's schedule using user level
        const schedule = getTodaysSchedule(level)
        setTodaySchedule(schedule)

        // Generate workout
        const session = getTodaysWorkoutSession(goal, level, equipment)
        setWorkout(session)

        // Generate diet
        const weekNumber = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
        const userData = {
            age: parseInt(profileData?.age || '25'),
            height: parseInt(profileData?.height || '175'),
            weight: parseInt(profileData?.weight || '70'),
            activityLevel: (profileData?.activityLevel || 'Moderate') as any,
            dietType: (profileData?.dietType || 'Non-Veg') as any,
            budget: (profileData?.budget || 'Medium') as any,
        }
        const diet = generateWeeklyDiet(userData, profileData?.goal === 'Fat Loss' ? 'Fat Loss' : profileData?.goal === 'Maintenance' ? 'Maintenance' : 'Muscle Gain', weekNumber)
        const todayDay = new Date().getDay() || 7
        const todayMeal = diet.weeklyPlan.find(d => d.day === todayDay) || diet.weeklyPlan[0]
        setTodayDiet({
            breakfast: todayMeal.breakfast,
            lunch: todayMeal.lunch,
            snack: todayMeal.snack,
            dinner: todayMeal.dinner,
            calories: diet.calories,
            protein: diet.protein,
        })

        // Load today's activities
        const scoreKey = `apex_daily_score_${todayKey()}`
        const savedActivities = getLocalJSON(scoreKey, activities)
        setActivities(savedActivities)
        setDailyScore(calculateDailyScore(savedActivities))

        // Load streak
        const savedStreak = getLocalJSON('apex_streak', {
            user_id: 'local', current_streak: 0, longest_streak: 0, last_active_date: '', updated_at: ''
        })
        setStreak({ current: savedStreak.current_streak, longest: savedStreak.longest_streak })

        // Load badges
        setBadges(getLocalJSON<Badge[]>('apex_badges', DEFAULT_BADGES))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleWorkoutComplete = () => {
        const newActivities = { ...activities, workout_completed: true, stretching_completed: true }
        setActivities(newActivities)
        const newScore = calculateDailyScore(newActivities)
        setDailyScore(newScore)
        localStorage.setItem(`apex_daily_score_${todayKey()}`, JSON.stringify(newActivities))

        const savedStreak = getLocalJSON('apex_streak', {
            user_id: 'local', current_streak: 0, longest_streak: 0, last_active_date: '', updated_at: ''
        })
        const newStreak = evaluateStreak(savedStreak, newScore)
        localStorage.setItem('apex_streak', JSON.stringify(newStreak))
        setStreak({ current: newStreak.current_streak, longest: newStreak.longest_streak })

        const newBadges = [...badges]
        const firstWorkout = newBadges.find(b => b.id === 'first_workout')
        if (firstWorkout && !firstWorkout.earned) {
            firstWorkout.earned = true
            firstWorkout.earnedDate = new Date().toISOString()
        }
        if (newStreak.current_streak >= 7) {
            const b = newBadges.find(b => b.id === '7_day_streak')
            if (b && !b.earned) { b.earned = true; b.earnedDate = new Date().toISOString() }
        }
        if (newStreak.current_streak >= 30) {
            const b = newBadges.find(b => b.id === '30_day_streak')
            if (b && !b.earned) { b.earned = true; b.earnedDate = new Date().toISOString() }
        }
        if (newScore >= 100) {
            const b = newBadges.find(b => b.id === 'perfect_score')
            if (b && !b.earned) { b.earned = true; b.earnedDate = new Date().toISOString() }
        }
        setBadges(newBadges)
        localStorage.setItem('apex_badges', JSON.stringify(newBadges))
    }

    const metrics = [
        { label: 'DAILY SCORE', val: String(dailyScore), unit: '/ 100', sub: 'Workout + Diet + Water', status: dailyScore >= 50 ? 'up' : 'neutral', icon: <Target className="w-3 h-3 text-apex-accent" /> },
        { label: 'WORKOUT STREAK', val: String(streak.current), unit: 'days', sub: streak.current >= 7 ? 'Gold Badge Active' : streak.current > 0 ? 'Keep going!' : 'Start today!', status: streak.current > 0 ? 'up' : 'neutral', icon: <Flame className="w-3 h-3 text-orange-500" /> },
        { label: 'BODY WEIGHT', val: bodyWeight, unit: 'kg', sub: 'From profile settings', status: 'neutral', icon: <Activity className="w-3 h-3 text-apex-info" /> },
        { label: 'PROGRESS', val: `${Math.round((dailyScore / 100) * 100)}`, unit: '%', sub: `Score ${dailyScore}/100 today`, status: dailyScore > 0 ? 'up' : 'neutral', icon: <TrendingUp className="w-3 h-3 text-green-400" /> },
    ]

    return (
        <div className="space-y-8 animate-fade-up">
            {!profile && (
                <div className="bg-apex-accent/10 border border-apex-accent/30 p-4 flex justify-between items-center animate-pulse">
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-apex-accent" />
                        <span className="text-[0.8rem] font-mono uppercase tracking-[1px]">Profile incomplete. AI generation is using default settings.</span>
                    </div>
                    <Link href="/dashboard/settings" className="text-[0.7rem] font-bold text-apex-accent border-b border-apex-accent hover:text-white transition-colors uppercase">
                        Complete Profile
                    </Link>
                </div>
            )}

            <header className="flex justify-between items-start">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">DASHBOARD OVERVIEW</div>
                    <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                        WELCOME BACK, <em className="text-apex-accent not-italic">{profile?.name || 'ATHLETE'}</em>
                    </h1>
                </div>
                <div className="flex items-center gap-5">
                    <div className="text-right">
                        <div className="text-[0.72rem] font-mono text-apex-muted uppercase">SYSTEM DATE</div>
                        <div className="text-[0.85rem] font-semibold text-apex-text">{today}</div>
                    </div>
                    <ProfileDropdown userName={profile?.name || 'ATHLETE'} />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-card border border-border-main p-[22px_20px] relative overflow-hidden group">
                        <div className="text-[0.62rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2.5 flex items-center gap-2">
                            {m.icon} {m.label}
                        </div>
                        <div className="font-display text-[2.6rem] leading-none flex items-baseline gap-1.5">
                            {m.val} <span className="text-base text-apex-muted lowercase">{m.unit}</span>
                        </div>
                        <div className={`text-[0.72rem] mt-1.5 font-medium ${m.status === 'up' ? 'text-green-400' : 'text-apex-muted'}`}>
                            {m.sub}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apex-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </div>
                ))}
            </div>

            <StreaksBadgesCard currentStreak={streak.current} longestStreak={streak.longest} badges={badges} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {todaySchedule && (
                        <TodaysWorkoutCard
                            workout={workout}
                            muscleGroup={todaySchedule.focus}
                            dayLabel={todaySchedule.label}
                            isRestDay={todaySchedule.focus === 'rest'}
                            onWorkoutComplete={handleWorkoutComplete}
                        />
                    )}
                    {todayDiet && (
                        <TodaysDietCard
                            breakfast={todayDiet.breakfast}
                            lunch={todayDiet.lunch}
                            snack={todayDiet.snack}
                            dinner={todayDiet.dinner}
                            calories={todayDiet.calories}
                            protein={todayDiet.protein}
                        />
                    )}
                </div>
                <div className="space-y-6">
                    <DailyScoreCard score={dailyScore} activities={activities} />
                </div>
            </div>
        </div>
    )
}
