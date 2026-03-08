'use client'

import { Target } from 'lucide-react'

interface DailyScoreCardProps {
    score: number
    activities: {
        workout_completed: boolean
        diet_followed: boolean
        water_goal: boolean
        steps_goal: boolean
        stretching_completed: boolean
    }
}

const SCORE_ITEMS = [
    { key: 'workout_completed', task: 'Workout Completed', pts: '+40' },
    { key: 'diet_followed', task: 'Diet Followed', pts: '+30' },
    { key: 'water_goal', task: 'Water Goal', pts: '+10' },
    { key: 'stretching_completed', task: 'Stretching', pts: '+10' },
    { key: 'steps_goal', task: 'Steps', pts: '+10' },
]

export default function DailyScoreCard({ score, activities }: DailyScoreCardProps) {
    const progress = score / 100
    const circumference = 2 * Math.PI * 84 // r=84
    const offset = circumference - circumference * progress

    return (
        <div className="bg-card border border-border-main p-7 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-apex-accent" />
                <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase">DAILY FITNESS SCORE</h3>
            </div>
            <p className="text-[0.7rem] text-apex-muted mb-5">Earn 100 points for a perfect day</p>

            {/* Circular Progress */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(200,255,0,0.3)]">
                        <circle cx="96" cy="96" r="84" fill="none" stroke="currentColor" strokeWidth="12" className="text-surface" />
                        <circle
                            cx="96" cy="96" r="84" fill="none" stroke="currentColor" strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="text-apex-accent transition-all duration-1000"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="font-display text-[2.8rem] leading-none text-apex-text drop-shadow-md">{score}</div>
                        <div className="text-[0.65rem] font-mono text-apex-accent tracking-[2px] mt-1">/ 100 POINTS</div>
                    </div>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2 mb-2">
                {SCORE_ITEMS.map((item, i) => {
                    const done = activities[item.key as keyof typeof activities]
                    return (
                        <div key={i} className="flex justify-between items-center text-[0.75rem] py-1.5 border-b border-border-main/50 last:border-0">
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-green-400' : 'bg-border-main'}`} />
                                <span className={done ? 'text-apex-text' : 'text-apex-muted'}>{item.task}</span>
                            </div>
                            <span className={`font-mono ${done ? 'text-apex-accent' : 'text-apex-muted'}`}>{item.pts}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
