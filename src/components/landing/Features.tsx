'use client'

import { Zap, Target, Activity, Shield, Trophy, Cpu } from 'lucide-react'

const features = [
    {
        icon: <Activity className="w-8 h-8 text-apex-accent" />,
        n: '01',
        name: 'ELITE WORKOUTS',
        desc: 'High-intensity, science-backed protocols for maximum muscle hypertrophy and strength gains.'
    },
    {
        icon: <Target className="w-8 h-8 text-apex-accent" />,
        n: '02',
        name: 'PRECISION DIET',
        desc: 'Dynamic meal plans and macro tracking tailored to your specific metabolic profile.'
    },
    {
        icon: <Cpu className="w-8 h-8 text-apex-accent" />,
        n: '03',
        name: 'AI ANALYTICS',
        desc: 'Advanced data models to track your progress and adjust your plan in real-time.'
    },
    {
        icon: <Shield className="w-8 h-8 text-apex-accent" />,
        n: '04',
        name: 'COMMUNITY',
        desc: 'Gain access to an exclusive network of high-performers and elite coaches.'
    },
    {
        icon: <Trophy className="w-8 h-8 text-apex-accent" />,
        n: '05',
        name: 'MILESTONES',
        desc: 'Gamified progress tracking with real-world rewards for hitting your goals.'
    },
    {
        icon: <Zap className="w-8 h-8 text-apex-accent" />,
        n: '06',
        name: 'APEX ENGINE',
        desc: 'The most advanced performance optimization engine ever built for mobile.'
    }
]

export default function Features() {
    return (
        <section id="features" className="section py-[100px] px-6 lg:px-[60px] border-top border-border-main">
            <div className="sec-label font-mono text-[0.7rem] text-apex-accent tracking-[3px] uppercase mb-3.5">
                CORE SYSTEM
            </div>
            <h2 className="sec-title font-display text-[48px] lg:text-[72px] leading-none mb-[60px] uppercase">
                ARCHITECTED FOR <br /><em className="text-apex-accent not-italic">DOMINATION</em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border-main border border-border-main">
                {features.map((feat, i) => (
                    <div key={i} className="bg-card p-11 transition-colors hover:bg-[#1f1f1f]">
                        <div className="mb-[22px]">
                            {feat.icon}
                        </div>
                        <div className="font-mono text-[0.65rem] text-apex-dim tracking-[2px] mb-3">
                            {feat.n}
                        </div>
                        <h3 className="font-display text-[1.7rem] tracking-[1px] mb-3 uppercase">
                            {feat.name}
                        </h3>
                        <p className="text-apex-muted text-[0.88rem] leading-[1.7]">
                            {feat.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
