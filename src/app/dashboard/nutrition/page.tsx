'use client'

import { useState, useEffect } from 'react'
import { analyzeBody, generateWeeklyDiet, UserData, BodyAnalysis, DietPlan } from '@/lib/diet-engine'
import { Info, Calendar, Flame, Target, ChevronRight, ChevronLeft, Loader2, Apple, Utensils, Zap, Clock, Lock } from 'lucide-react'
import Link from 'next/link'

export default function NutritionPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [weekOffset, setWeekOffset] = useState(1)
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
    const [analysis, setAnalysis] = useState<BodyAnalysis | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem('apex_athlete_profile')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                setProfile(data)

                const userData: UserData = {
                    age: Number(data.age) || 25,
                    height: Number(data.height) || 175,
                    weight: Number(data.weight) || 70,
                    activityLevel: data.activityLevel || 'Moderate',
                    dietType: (data.dietType || 'Non-Veg') as any,
                }

                const bodyAnalysis = analyzeBody(userData)
                const plan = generateWeeklyDiet(userData, bodyAnalysis.goal, weekOffset)

                setAnalysis(bodyAnalysis)
                setDietPlan(plan)
            } catch (e) {
                console.error("Nutrition profile load error", e)
            }
        }
        setLoading(false)
    }, [weekOffset])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-apex-accent" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="p-12 text-center bg-surface border border-border-main animate-fade-up">
                <div className="w-16 h-16 bg-apex-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Apple className="w-8 h-8 text-apex-accent" />
                </div>
                <h2 className="text-2xl font-display mb-3 tracking-wider uppercase">PROFILE DATA MISSING</h2>
                <p className="text-apex-muted mb-8 max-w-md mx-auto">We need your age, height, and weight to calculate the perfect South Indian diet plan for your goals.</p>
                <Link
                    href="/dashboard/settings"
                    className="inline-block px-8 py-3 bg-apex-accent text-bg font-bold tracking-[2px] uppercase hover:bg-white transition-colors"
                >
                    Initialize Profile
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[4px] text-apex-accent uppercase mb-2">
                        ELITE NUTRITION ENGINE
                    </div>
                    <h1 className="font-display text-[2.8rem] tracking-[1px] uppercase leading-none">
                        WEEKLY <em className="text-apex-accent not-italic">FORGE</em>
                    </h1>
                    <p className="text-apex-muted text-[0.85rem] mt-2 font-mono">CALIBRATED FOR: {profile.name?.toUpperCase() || 'ATHLETE'}</p>
                </div>

                <div className="flex items-center gap-1 bg-surface p-1 border border-border-main">
                    <button
                        onClick={() => setWeekOffset(prev => Math.max(1, prev - 1))}
                        className={`p-2.5 transition-colors ${weekOffset === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 text-apex-accent'}`}
                        disabled={weekOffset === 1}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="font-mono text-[0.7rem] font-bold tracking-[2px] px-6 text-center uppercase">
                        Current <span className="text-apex-accent">Week {weekOffset}</span>
                    </div>
                    <button
                        onClick={() => setWeekOffset(prev => prev + 1)}
                        className="p-2.5 hover:bg-white/5 text-apex-accent transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'BODY TYPE', val: analysis?.bodyType, icon: <Info className="w-4 h-4" />, color: 'text-blue-400' },
                    { label: 'ATHLETE GOAL', val: analysis?.goal, icon: <Target className="w-4 h-4" />, color: 'text-apex-accent' },
                    { label: 'DAILY FUEL', val: `${Math.round(dietPlan?.calories || 0)}`, unit: 'KCAL', icon: <Flame className="w-4 h-4" />, color: 'text-orange-500' },
                    { label: 'PROTEIN TARGET', val: `${Math.round(dietPlan?.protein || 0)}`, unit: 'G', icon: <Zap className="w-4 h-4" />, color: 'text-green-400' },
                ].map((item, i) => (
                    <div key={i} className="bg-card border border-border-main p-6 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[0.6rem] font-mono text-apex-muted tracking-[2px] uppercase">{item.label}</span>
                            <div className={`${item.color} opacity-80 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                        </div>
                        <div className="font-display text-3xl tracking-[1px] text-apex-text flex items-baseline gap-2">
                            {item.val}
                            {item.unit && <span className="text-xs font-mono text-apex-dim">{item.unit}</span>}
                        </div>
                        <div className="absolute bottom-0 left-0 h-[2px] bg-apex-accent w-0 group-hover:w-full transition-all duration-500" />
                    </div>
                ))}
            </div>

            {/* Weekly Plan */}
            <div className="bg-card border border-border-main">
                <div className="p-6 border-b border-border-main flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-apex-accent/10 border border-apex-accent/20">
                            <Calendar className="w-5 h-5 text-apex-accent" />
                        </div>
                        <div>
                            <h2 className="font-display text-2xl tracking-[1px] uppercase">SOUTH INDIAN ROTATING PLAN</h2>
                            <p className="text-[0.7rem] font-mono text-apex-muted uppercase tracking-[1px]">Optimized for Telugu States & Local Ingredients</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[0.6rem] font-mono p-[4px_12px] bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-[1px]">
                            {profile.dietType?.toUpperCase()} ACTIVE
                        </span>
                        <span className="text-[0.6rem] font-mono p-[4px_12px] bg-apex-accent/10 text-apex-accent border border-apex-accent/20 uppercase tracking-[1px]">
                            WEEK {weekOffset} UNLOCKED
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    {dietPlan?.weeklyPlan.map((day: any) => (
                        <div key={day.day} className="grid grid-cols-1 lg:grid-cols-[100px_1fr] border-b border-border-main last:border-0 group">
                            <div className="bg-surface/50 p-8 flex lg:flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border-main group-hover:bg-apex-accent/5 transition-colors">
                                <span className="text-[0.6rem] font-mono text-apex-dim uppercase tracking-[2px] lg:mb-1 mr-4 lg:mr-0">DAY</span>
                                <span className="font-display text-4xl text-apex-accent leading-none">{day.day}</span>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 bg-card group-hover:bg-white/[0.01] transition-colors relative">
                                {[
                                    { label: 'BREAKFAST', meal: day.breakfast, icon: <Clock className="w-3 h-3" />, time: '08:00 AM' },
                                    { label: 'LUNCH', meal: day.lunch, icon: <Utensils className="w-3 h-3" />, time: '01:30 PM' },
                                    { label: 'SNACK', meal: day.snack, icon: <Apple className="w-3 h-3" />, time: '05:00 PM' },
                                    { label: 'DINNER', meal: day.dinner, icon: <Utensils className="w-3 h-3" />, time: '08:30 PM' },
                                ].map((m, idx) => (
                                    <div key={idx} className="space-y-3 relative">
                                        <div className="flex items-center justify-between border-b border-border-main/30 pb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="text-apex-accent">{m.icon}</div>
                                                <span className="text-[0.6rem] font-mono text-apex-accent tracking-[2px] uppercase font-bold">{m.label}</span>
                                            </div>
                                            <span className="text-[0.55rem] font-mono text-apex-dim">{m.time}</span>
                                        </div>
                                        <div className="text-[1rem] leading-relaxed font-semibold text-apex-text min-h-[3rem]">
                                            {m.meal}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-apex-accent/20" />
                                            <div className="w-2 h-2 rounded-full bg-apex-accent/20" />
                                            <div className="w-2 h-2 rounded-full bg-apex-accent/20" />
                                        </div>
                                    </div>
                                ))}

                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-2 border border-apex-accent/30 bg-apex-accent/5 cursor-pointer hover:bg-apex-accent/10">
                                        <ChevronRight className="w-4 h-4 text-apex-accent" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Retension Lock Visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[weekOffset + 1, weekOffset + 2, weekOffset + 3].map(w => (
                    <div key={w} className="bg-surface border border-border-main p-6 flex items-center justify-between opacity-50 relative overflow-hidden grayscale">
                        <div className="flex items-center gap-4">
                            <Lock className="w-5 h-5 text-apex-dim" />
                            <div>
                                <div className="text-[0.6rem] font-mono text-apex-dim uppercase tracking-[1px]">FUTURE PLAN</div>
                                <div className="font-display text-xl uppercase tracking-[1px]">WEEK {w}</div>
                            </div>
                        </div>
                        <div className="text-[0.55rem] font-mono text-apex-dim text-right max-w-[80px] uppercase">
                            Unlock on Monday
                        </div>
                    </div>
                ))}
            </div>

            <footer className="p-6 bg-apex-accent/5 border border-apex-accent/10 flex items-start gap-4">
                <div className="p-2 bg-apex-accent/10 border border-apex-accent/20">
                    <Info className="w-5 h-5 text-apex-accent" />
                </div>
                <div>
                    <h4 className="text-[0.8rem] font-bold text-apex-text uppercase tracking-[1px] mb-1">Dietary Disclaimer</h4>
                    <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                        These plans are dynamically generated by APEX AI based on South Indian staple foods common in Telangana and Andhra Pradesh.
                        They are designed to meet your macro targets while remaining simple and affordable.
                        Always consult with a qualified nutritionist or medical professional for specific health conditions.
                    </p>
                </div>
            </footer>
        </div>
    )
}
