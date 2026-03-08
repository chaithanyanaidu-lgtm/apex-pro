'use client'

import { Flame, Trophy, Medal, Star, Zap, Crown, Lock } from 'lucide-react'
import { Badge } from '@/types/fitness'

interface StreaksBadgesCardProps {
    currentStreak: number
    longestStreak: number
    badges: Badge[]
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
    trophy: <Trophy className="w-6 h-6" />,
    medal: <Medal className="w-6 h-6" />,
    star: <Star className="w-6 h-6" />,
    flame: <Flame className="w-6 h-6" />,
    zap: <Zap className="w-6 h-6" />,
    crown: <Crown className="w-6 h-6" />,
}

const BADGE_COLORS: Record<string, string> = {
    trophy: 'text-yellow-500',
    medal: 'text-gray-300',
    star: 'text-yellow-400',
    flame: 'text-orange-500',
    zap: 'text-cyan-400',
    crown: 'text-amber-400',
}

export default function StreaksBadgesCard({ currentStreak, longestStreak, badges }: StreaksBadgesCardProps) {
    return (
        <div className="relative overflow-hidden border border-border-main p-6"
            style={{
                background: 'linear-gradient(135deg, rgba(200,255,0,0.04) 0%, rgba(8,8,8,1) 40%, rgba(255,69,0,0.04) 100%)',
            }}
        >
            {/* Shimmer border effect */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(200,255,0,0.08), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite',
                }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row gap-6">
                {/* Streak Section */}
                <div className="flex items-center gap-4 lg:min-w-[260px]">
                    <div className="w-14 h-14 bg-orange-500/15 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                        <Flame className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="font-display text-[2rem] leading-none tracking-wider">
                            {currentStreak} <span className="text-[1rem] text-apex-muted">DAY STREAK</span>
                        </div>
                        <div className="text-[0.65rem] font-mono text-apex-dim mt-1">
                            LONGEST: {longestStreak} DAYS
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-border-main" />
                <div className="block lg:hidden h-px bg-border-main" />

                {/* Badges Section */}
                <div className="flex-1">
                    <div className="text-[0.6rem] font-mono text-apex-muted tracking-[2px] uppercase mb-3">EARNED BADGES</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {badges.map((badge) => (
                            <div
                                key={badge.id}
                                className={`flex flex-col items-center p-3 border border-border-main bg-surface/50 transition-all ${badge.earned
                                        ? 'opacity-100 hover:border-apex-accent/30'
                                        : 'opacity-40 grayscale'
                                    }`}
                                title={badge.description}
                            >
                                <div className={`mb-1.5 ${badge.earned ? BADGE_COLORS[badge.icon] : 'text-apex-dim'} ${badge.earned ? 'animate-glow-pulse' : ''}`}>
                                    {badge.earned ? BADGE_ICONS[badge.icon] : <Lock className="w-5 h-5" />}
                                </div>
                                <span className={`text-[0.6rem] font-bold uppercase tracking-wider text-center leading-tight ${badge.earned ? BADGE_COLORS[badge.icon] : 'text-apex-dim'
                                    }`}>
                                    {badge.name}
                                </span>
                                {badge.earned && badge.earnedDate && (
                                    <span className="text-[0.5rem] text-apex-dim mt-0.5">
                                        {new Date(badge.earnedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
