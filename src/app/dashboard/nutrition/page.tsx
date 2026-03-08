'use client'

import { useState, useEffect } from 'react'
import { analyzeBody, generateWeeklyDiet, UserData, BodyAnalysis, DietPlan, FOOD_DETAILS, FoodDetail } from '@/lib/diet-engine'
import { Info, Calendar, Flame, Target, ChevronRight, ChevronLeft, Loader2, Apple, Utensils, Zap, Clock, Coffee, Sun, Moon, Cookie, GlassWater } from 'lucide-react'
import Link from 'next/link'
import DietDetailPanel from '@/components/dashboard/DietDetailPanel'

export default function NutritionPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [weekOffset, setWeekOffset] = useState(1)
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
    const [analysis, setAnalysis] = useState<BodyAnalysis | null>(null)
    const [selectedMeal, setSelectedMeal] = useState<{ label: string; name: string; detail: FoodDetail | null } | null>(null)

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
                    budget: data.budget || 'Medium',
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

    const handleMealClick = (label: string, name: string) => {
        // Look up food detail — try exact match, then partial
        let detail = FOOD_DETAILS[name] || null
        if (!detail) {
            const key = Object.keys(FOOD_DETAILS).find(k => name.includes(k) || k.includes(name))
            if (key) detail = FOOD_DETAILS[key]
        }
        setSelectedMeal({ label, name, detail })
    }

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
                <p className="text-apex-muted mb-8 max-w-md mx-auto">We need your age, height, and weight to calculate the perfect diet plan for your goals.</p>
                <Link
                    href="/dashboard/settings"
                    className="inline-block px-8 py-3 bg-apex-accent text-bg font-bold tracking-[2px] uppercase hover:bg-white transition-colors"
                >
                    Initialize Profile
                </Link>
            </div>
        )
    }

    const MEAL_ICONS = {
        emptyStomach: <GlassWater className="w-3 h-3" />,
        breakfast: <Coffee className="w-3 h-3" />,
        lunch: <Sun className="w-3 h-3" />,
        snack: <Cookie className="w-3 h-3" />,
        dinner: <Moon className="w-3 h-3" />,
    }

    const MEAL_COLORS: Record<string, string> = {
        emptyStomach: 'text-cyan-400',
        breakfast: 'text-amber-400',
        lunch: 'text-orange-400',
        snack: 'text-green-400',
        dinner: 'text-indigo-400',
    }

    const MEAL_TIMES: Record<string, string> = {
        emptyStomach: '6:00 AM',
        breakfast: '7:30 AM',
        lunch: '1:00 PM',
        snack: '4:30 PM',
        dinner: '8:00 PM',
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[4px] text-apex-accent uppercase mb-2">
                        NUTRITION ENGINE
                    </div>
                    <h1 className="font-display text-[2.8rem] tracking-[1px] uppercase leading-none">
                        DIET & <em className="text-apex-accent not-italic">NUTRITION</em>
                    </h1>
                    <p className="text-apex-muted text-[0.85rem] mt-2 font-mono">CALIBRATED FOR: {profile.name?.toUpperCase() || 'ATHLETE'} • BUDGET: {(profile.budget || 'Medium').toUpperCase()}</p>
                </div>

                <div className="flex items-center gap-1 bg-surface p-1 border border-border-main">
                    <button
                        onClick={() => setWeekOffset(prev => Math.max(1, prev - 1))}
                        className={`p-2.5 transition-colors cursor-pointer ${weekOffset === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 text-apex-accent'}`}
                        disabled={weekOffset === 1}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="font-mono text-[0.7rem] font-bold tracking-[2px] px-6 text-center uppercase">
                        Current <span className="text-apex-accent">Week {weekOffset}</span>
                    </div>
                    <button
                        onClick={() => setWeekOffset(prev => prev + 1)}
                        className="p-2.5 hover:bg-white/5 text-apex-accent transition-colors cursor-pointer"
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
                            <h2 className="font-display text-2xl tracking-[1px] uppercase">WEEKLY MEAL PLAN</h2>
                            <p className="text-[0.7rem] font-mono text-apex-muted uppercase tracking-[1px]">Optimized for Your Goals & Budget</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[0.6rem] font-mono p-[4px_12px] bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-[1px]">
                            {profile.dietType?.toUpperCase()} ACTIVE
                        </span>
                        <span className="text-[0.6rem] font-mono p-[4px_12px] bg-apex-accent/10 text-apex-accent border border-apex-accent/20 uppercase tracking-[1px]">
                            WEEK {weekOffset}
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

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 bg-card group-hover:bg-white/[0.01] transition-colors">
                                {[
                                    { key: 'emptyStomach', label: 'EMPTY STOMACH', meal: day.emptyStomach },
                                    { key: 'breakfast', label: 'BREAKFAST', meal: day.breakfast },
                                    { key: 'lunch', label: 'LUNCH', meal: day.lunch },
                                    { key: 'snack', label: 'SNACK', meal: day.snack },
                                    { key: 'dinner', label: 'DINNER', meal: day.dinner },
                                ].map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => handleMealClick(m.label, m.meal)}
                                        className="space-y-2 text-left hover:bg-surface/50 p-3 border border-transparent hover:border-border-main transition-all cursor-pointer rounded-sm"
                                    >
                                        <div className="flex items-center justify-between border-b border-border-main/30 pb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <div className={MEAL_COLORS[m.key]}>{MEAL_ICONS[m.key as keyof typeof MEAL_ICONS]}</div>
                                                <span className="text-[0.55rem] font-mono text-apex-accent tracking-[1.5px] uppercase font-bold">{m.label}</span>
                                            </div>
                                            <span className="text-[0.5rem] font-mono text-apex-dim">{MEAL_TIMES[m.key]}</span>
                                        </div>
                                        <div className="text-[0.85rem] leading-relaxed font-semibold text-apex-text min-h-[2.5rem]">
                                            {m.meal}
                                        </div>
                                        <div className="text-[0.55rem] font-mono text-apex-dim">TAP FOR DETAILS →</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <footer className="p-6 bg-apex-accent/5 border border-apex-accent/10 flex items-start gap-4">
                <div className="p-2 bg-apex-accent/10 border border-apex-accent/20">
                    <Info className="w-5 h-5 text-apex-accent" />
                </div>
                <div>
                    <h4 className="text-[0.8rem] font-bold text-apex-text uppercase tracking-[1px] mb-1">Dietary Disclaimer</h4>
                    <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                        These plans are dynamically generated by the APEX AI engine based on your profile data, fitness goals, and selected budget tier.
                        Always consult with a qualified nutritionist or medical professional for specific health conditions.
                    </p>
                </div>
            </footer>

            {/* Detail Panel */}
            {selectedMeal && (
                <DietDetailPanel
                    mealLabel={selectedMeal.label}
                    mealName={selectedMeal.name}
                    detail={selectedMeal.detail}
                    onClose={() => setSelectedMeal(null)}
                />
            )}
        </div>
    )
}
