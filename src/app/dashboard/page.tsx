'use client'

import { useEffect, useState } from 'react'
import { generateWorkoutSession } from '@/lib/workout-engine'
import { Activity, Flame, Target, TrendingUp, Trophy, Medal, Star, Dumbbell, Info } from 'lucide-react'
import Link from 'next/link'

const initialMetrics = [
    { label: 'DAILY SCORE', val: '80', unit: '/ 100', sub: 'Workout + Diet + Water', status: 'up' },
    { label: 'WORKOUT STREAK', val: '12', unit: 'days', sub: 'Gold Badge Active', status: 'up' },
    { label: 'BODY WEIGHT', val: '84.2', unit: 'kg', sub: '-1.2kg this month', status: 'down' },
    { label: 'ACTIVE TIME', val: '72', unit: 'min', sub: '+12 from average', status: 'up' },
]

export default function DashboardOverview() {
    const [workout, setWorkout] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    useEffect(() => {
        const saved = localStorage.getItem('apex_athlete_profile')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                const mapped = {
                    name: data.name || 'ATHLETE',
                    goal: (data.goal || 'Muscle Gain').toLowerCase().replace(' ', '_'),
                    level: (data.level || 'Intermediate').toLowerCase(),
                    equipment: (data.equipment || 'Full Gym').toLowerCase().replace(' ', '_')
                }
                setProfile(mapped)

                const session = generateWorkoutSession(
                    mapped.goal as any,
                    mapped.level as any,
                    mapped.equipment as any,
                    'full_body'
                )
                setWorkout(session)
            } catch (e) {
                console.error("Dashboard profile load error", e)
            }
        }
    }, [])

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
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
                        DASHBOARD OVERVIEW
                    </div>
                    <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                        WELCOME BACK, <em className="text-apex-accent not-italic">{profile?.name || 'ATHLETE'}</em>
                    </h1>
                </div>
                <div className="text-right">
                    <div className="text-[0.72rem] font-mono text-apex-muted uppercase">SYSTEM DATE</div>
                    <div className="text-[0.85rem] font-semibold text-apex-text">{today}</div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {initialMetrics.map((m, i) => (
                    <div key={i} className="bg-card border border-border-main p-[22px_20px] relative overflow-hidden group">
                        <div className="text-[0.62rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2.5 flex items-center gap-2">
                            {m.label === 'DAILY SCORE' && <Target className="w-3 h-3 text-apex-accent" />}
                            {m.label === 'WORKOUT STREAK' && <Flame className="w-3 h-3 text-orange-500" />}
                            {m.label}
                        </div>
                        <div className="font-display text-[2.6rem] leading-none flex items-baseline gap-1.5">
                            {m.val} <span className="text-base text-apex-muted lowercase">{m.unit}</span>
                        </div>
                        <div className={`text-[0.72rem] mt-1.5 font-medium ${m.status === 'up' ? 'text-green-400' : m.status === 'down' ? 'text-apex-danger' : 'text-apex-muted'
                            }`}>
                            {m.sub}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-apex-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Workout */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border-main p-7">
                        <div className="flex justify-between items-center mb-5.5">
                            <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase">TODAY'S WORKOUT</h3>
                            {workout && (
                                <span className="text-[0.6rem] font-mono text-apex-accent tracking-[2px] uppercase bg-apex-accent/10 p-[4px_10px] border border-apex-accent/20">
                                    {workout.name}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-7 gap-1 md:gap-[5px] mb-5">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div
                                    key={i}
                                    className={`text-center py-2 text-[0.6rem] font-mono tracking-[1px] ${i === 4 ? 'bg-apex-accent text-bg font-bold' : 'bg-surface text-apex-dim'
                                        }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            {workout?.exercises.map((ex: any, i: number) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center gap-3.5 p-[13px_15px] bg-surface border border-border-main hover:border-border-sub transition-colors">
                                    <div className="flex gap-3.5 items-center flex-1">
                                        <Dumbbell className="w-5 h-5 text-apex-accent flex-shrink-0" />
                                        <div>
                                            <div className="text-[0.88rem] font-semibold flex items-center gap-2">
                                                {ex.name}
                                            </div>
                                            <div className="text-[0.72rem] text-apex-muted font-mono mt-0.5">
                                                {ex.sets} SETS • {ex.reps} REPS • {ex.rest}s REST
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 ml-8 md:ml-0">
                                        {Array.from({ length: ex.sets }).map((_, s) => (
                                            <div key={s} className="w-2.5 h-2.5 rounded-full border border-border-main bg-transparent" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {!workout && (
                                <div className="text-center py-10 border border-dashed border-border-main text-apex-muted text-[0.8rem] font-mono uppercase">
                                    INITIALIZING TRAINING SESSION...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Score & Streaks Column */}
                <div className="space-y-6">
                    {/* Daily Score Circular Progress */}
                    <div className="bg-card border border-border-main p-7 text-center">
                        <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase mb-1">DAILY FITNESS SCORE</h3>
                        <p className="text-[0.7rem] text-apex-muted mb-5">Earn 100 points for a perfect day</p>

                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(255,51,102,0.3)]">
                                    <circle cx="96" cy="96" r="84" fill="none" stroke="currentColor" strokeWidth="12" className="text-surface" />
                                    <circle cx="96" cy="96" r="84" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="527" strokeDashoffset={527 - (527 * 0.8)} className="text-apex-accent stroke-linecap-round transition-all duration-1000" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="font-display text-[2.8rem] leading-none text-apex-text drop-shadow-md">80</div>
                                    <div className="text-[0.65rem] font-mono text-apex-accent tracking-[2px] mt-1">/ 100 POINTS</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-2">
                            {[
                                { task: 'Workout Completed', pts: '+40', done: true },
                                { task: 'Diet Followed', pts: '+30', done: true },
                                { task: 'Water Goal', pts: '+10', done: true },
                                { task: 'Stretching', pts: '+10', done: false },
                                { task: 'Steps', pts: '+10', done: false },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-[0.75rem] py-1.5 border-b border-border-main/50 last:border-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.done ? 'bg-green-400' : 'bg-border-main'}`} />
                                        <span className={item.done ? 'text-apex-text' : 'text-apex-muted'}>{item.task}</span>
                                    </div>
                                    <span className={`font-mono ${item.done ? 'text-apex-accent' : 'text-apex-muted'}`}>{item.pts}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Streaks & Badges */}
                    <div className="bg-card border border-border-main p-7">
                        <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase mb-4">STREAKS & BADGES</h3>
                        <div className="flex items-center gap-4 mb-5 p-3 bg-surface border border-border-main">
                            <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-display text-xl leading-none">12 DAY STREAK</div>
                                <div className="text-[0.65rem] text-apex-muted">Longest: 24 Days</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center p-2 border border-border-main bg-surface opactiy-100">
                                <Trophy className="w-6 h-6 text-yellow-600 mb-1" />
                                <span className="text-[0.55rem] font-bold text-yellow-600 uppercase tracking-wider">Bronze</span>
                                <span className="text-[0.55rem] text-apex-muted">3 Days</span>
                            </div>
                            <div className="flex flex-col items-center p-2 border border-border-main bg-surface opactiy-100">
                                <Medal className="w-6 h-6 text-gray-300 mb-1" />
                                <span className="text-[0.55rem] font-bold text-gray-300 uppercase tracking-wider">Silver</span>
                                <span className="text-[0.55rem] text-apex-muted">7 Days</span>
                            </div>
                            <div className="flex flex-col items-center p-2 border border-border-main bg-surface opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
                                <Star className="w-6 h-6 text-yellow-400 mb-1" />
                                <span className="text-[0.55rem] font-bold text-yellow-400 uppercase tracking-wider">Elite</span>
                                <span className="text-[0.55rem] text-apex-muted">30 Days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

