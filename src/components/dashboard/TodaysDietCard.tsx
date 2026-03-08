'use client'

import { Utensils, Coffee, Sun, Moon, Cookie } from 'lucide-react'

interface TodaysDietCardProps {
    breakfast: string
    lunch: string
    snack: string
    dinner: string
    calories: number
    protein: number
}

export default function TodaysDietCard({ breakfast, lunch, snack, dinner, calories, protein }: TodaysDietCardProps) {
    const meals = [
        { icon: <Coffee className="w-4 h-4" />, label: 'BREAKFAST', items: breakfast, time: '7:00 - 8:00 AM', color: 'text-amber-400' },
        { icon: <Sun className="w-4 h-4" />, label: 'LUNCH', items: lunch, time: '12:30 - 1:30 PM', color: 'text-orange-400' },
        { icon: <Cookie className="w-4 h-4" />, label: 'SNACK', items: snack, time: '4:00 - 5:00 PM', color: 'text-cyan-400' },
        { icon: <Moon className="w-4 h-4" />, label: 'DINNER', items: dinner, time: '7:30 - 8:30 PM', color: 'text-indigo-400' },
    ]

    return (
        <div className="bg-card border border-border-main p-7">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase">DIET & NUTRITION</h3>
                    <span className="text-[0.6rem] font-mono text-apex-accent tracking-[2px] uppercase mt-1 block">
                        TODAY&apos;S MEAL PLAN
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-apex-accent" />
                </div>
            </div>

            {/* Macro Summary */}
            <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-surface border border-border-main p-3 text-center">
                    <div className="text-[0.6rem] font-mono text-apex-muted tracking-[1.5px] uppercase">CALORIES</div>
                    <div className="font-display text-xl text-apex-text mt-0.5">{Math.round(calories)} <span className="text-[0.7rem] text-apex-muted">kcal</span></div>
                </div>
                <div className="bg-surface border border-border-main p-3 text-center">
                    <div className="text-[0.6rem] font-mono text-apex-muted tracking-[1.5px] uppercase">PROTEIN</div>
                    <div className="font-display text-xl text-apex-text mt-0.5">{Math.round(protein)} <span className="text-[0.7rem] text-apex-muted">g</span></div>
                </div>
            </div>

            {/* Meals */}
            <div className="space-y-2">
                {meals.map((meal, i) => (
                    <div key={i} className="bg-surface border border-border-main p-4 hover:border-border-sub transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={meal.color}>{meal.icon}</span>
                                <span className="text-[0.65rem] font-mono font-bold tracking-[2px] uppercase">{meal.label}</span>
                            </div>
                            <span className="text-[0.6rem] font-mono text-apex-dim">{meal.time}</span>
                        </div>
                        <div className="text-[0.85rem] text-apex-text/90 pl-6">
                            {meal.items}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
