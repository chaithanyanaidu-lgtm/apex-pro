'use client'

export default function Hero() {
    return (
        <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-6 lg:px-[60px] pt-20 gap-14 lg:gap-[60px]">
            <div className="flex flex-col">
                <div className="hero-eyebrow flex items-center gap-[10px] font-mono text-[0.7rem] text-apex-accent tracking-[3px] uppercase mb-6 before:content-[''] before:w-7 before:h-[1px] before:bg-apex-accent">
                    ELITE PERFORMANCE SYSTEM
                </div>

                <h1 className="font-display text-[72px] lg:text-[clamp(72px,9vw,130px)] leading-[0.88] tracking-[2px] mb-7 uppercase">
                    TRAIN LIKE A <em className="text-apex-accent not-italic">GOD</em>.<br />
                    EAT LIKE AN <em className="text-apex-accent not-italic">EXPERT</em>.
                </h1>

                <p className="text-apex-muted text-base lg:text-lg leading-[1.75] max-w-sm mb-11">
                    The ultimate science-backed system for body recomposition and elite performance tracking.
                </p>

                <div className="flex flex-wrap gap-[14px]">
                    <button className="bg-apex-accent text-bg px-[38px] py-[15px] text-[0.9rem] font-bold tracking-[2px] uppercase transition-all hover:bg-[#e0ff33] hover:-translate-y-0.5 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
                        START TRAINING
                    </button>
                    <button className="bg-transparent text-apex-text border border-border-sub px-[38px] py-[15px] text-[0.9rem] font-medium tracking-[1px] transition-all hover:border-apex-text">
                        EXPLORE PLANS
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {[
                    { num: '50K+', label: 'ELITE ATHLETES', desc: 'Trusting Apex for their performance transformation.' },
                    { num: '98%', label: 'SUCCESS RATE', desc: 'Of users reach their physique goals within 12 weeks.' },
                    { num: 'AI', label: 'PRECISION TRACKING', desc: 'Real-time AI adjustments to your macros and training.' },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border-main p-[28px_30px] border-l-[3px] border-l-apex-accent animate-fade-up opacity-0"
                        style={{ animationDelay: `${0.2 + i * 0.15}s`, animationFillMode: 'forwards' }}
                    >
                        <div className="font-display text-[3.2rem] text-apex-accent leading-none">
                            {stat.num}
                        </div>
                        <div className="text-[0.7rem] tracking-[2px] uppercase text-apex-muted mt-1.5">
                            {stat.label}
                        </div>
                        <p className="text-[0.85rem] text-apex-dim mt-2 leading-[1.5]">
                            {stat.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
