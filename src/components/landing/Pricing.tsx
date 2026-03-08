'use client'

import { Check, Lock } from 'lucide-react'

const plans = [
    {
        n: 'CORE',
        price: '$0',
        per: '/FOREVER',
        feats: [
            { text: 'Basic Workout Library', locked: false },
            { text: 'Simple Macro Tracker', locked: false },
            { text: 'Progress Photos', locked: false },
            { text: 'Apex Community Access', locked: true },
            { text: 'AI Training Adjustments', locked: true },
        ],
        featured: false,
        cta: 'START FREE'
    },
    {
        n: 'PRO',
        price: '$29',
        per: '/MONTH',
        badge: 'MOST POPULAR',
        feats: [
            { text: 'Advanced Training Protocols', locked: false },
            { text: 'Precision Macros & AI Nutri', locked: false },
            { text: 'Priority Support', locked: false },
            { text: 'Apex Exclusive Forge', locked: false },
            { text: 'AI Form Analysis', locked: true },
        ],
        featured: true,
        cta: 'GO PRO NOW'
    },
    {
        n: 'ELITE',
        price: '$99',
        per: '/MONTH',
        feats: [
            { text: 'Custom 1-on-1 Coaching', locked: false },
            { text: 'Full Metabolic Screening', locked: false },
            { text: 'Apex Biofeedback Integration', locked: false },
            { text: 'The Vault Access', locked: false },
            { text: 'Private Mastermind', locked: false },
        ],
        featured: false,
        cta: 'APPLY NOW'
    }
]

export default function Pricing() {
    return (
        <section id="pricing" className="section py-[100px] px-6 lg:px-[60px] border-top border-border-main">
            <div className="sec-label font-mono text-[0.7rem] text-apex-accent tracking-[3px] uppercase mb-3.5">
                MEMBERSHIP
            </div>
            <h2 className="sec-title font-display text-[48px] lg:text-[72px] leading-none mb-[60px] uppercase">
                CHOOSE YOUR <br /><em className="text-apex-accent not-italic">LEVEL</em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`relative p-[44px_36px] transition-transform hover:-translate-y-1 ${plan.featured ? 'bg-apex-accent border-apex-accent' : 'bg-card border border-border-main'
                            }`}
                    >
                        {plan.badge && (
                            <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-apex-danger text-white text-[0.65rem] font-bold tracking-[2px] px-3.5 py-1 uppercase">
                                {plan.badge}
                            </div>
                        )}

                        <div className={`font-mono text-[0.7rem] tracking-[3px] uppercase mb-4.5 ${plan.featured ? 'text-black/50' : 'text-apex-muted'
                            }`}>
                            {plan.n}
                        </div>

                        <div className={`font-display text-[4.5rem] leading-none mb-1 ${plan.featured ? 'text-bg' : 'text-apex-text'
                            }`}>
                            {plan.price}
                        </div>

                        <div className={`text-[0.82rem] mb-8 ${plan.featured ? 'text-black/50' : 'text-apex-muted'
                            }`}>
                            {plan.per}
                        </div>

                        <ul className="mb-9">
                            {plan.feats.map((feat, j) => (
                                <li
                                    key={j}
                                    className={`flex items-center gap-[9px] py-[9px] text-[0.88rem] border-b ${plan.featured ? 'text-black/70 border-black/10' : 'text-apex-muted border-border-main'
                                        } ${feat.locked ? 'text-apex-dim' : ''}`}
                                >
                                    {feat.locked ? (
                                        <Lock className="w-3 h-3 flex-shrink-0" />
                                    ) : (
                                        <span className={`text-[0.75rem] flex-shrink-0 ${plan.featured ? 'text-bg' : 'text-apex-accent'}`}>→</span>
                                    )}
                                    {feat.text}
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-3.5 text-[0.85rem] font-bold tracking-[2px] uppercase transition-colors ${plan.featured ? 'bg-bg text-apex-accent hover:bg-[#111]' : 'bg-apex-accent text-bg hover:bg-[#e0ff33]'
                            }`}>
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}
