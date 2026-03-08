'use client'

import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 py-4 md:px-[60px] md:py-[18px] bg-bg/90 backdrop-blur-xl border-b border-border-main">
            <div className="logo-mark font-display text-2xl tracking-[4px] text-apex-accent">
                APEX
            </div>

            <div className="hidden md:flex items-center gap-9">
                <Link href="#features" className="text-apex-muted text-[0.85rem] tracking-[1px] transition-colors hover:text-apex-text">
                    SYSTEM
                </Link>
                <Link href="#training" className="text-apex-muted text-[0.85rem] tracking-[1px] transition-colors hover:text-apex-text">
                    TRAINING
                </Link>
                <Link href="#nutrition" className="text-apex-muted text-[0.85rem] tracking-[1px] transition-colors hover:text-apex-text">
                    NUTRITION
                </Link>
                <Link href="#pricing" className="text-apex-muted text-[0.85rem] tracking-[1px] transition-colors hover:text-apex-text">
                    MEMBERSHIP
                </Link>
            </div>

            <div className="flex gap-3">
                <Link href="/login" className="px-6 py-[9px] text-[0.85rem] font-semibold tracking-[1px] text-apex-text border border-border-sub transition-all hover:border-apex-accent hover:text-apex-accent">
                    LOGIN
                </Link>
                <Link href="/signup" className="px-6 py-[9px] text-[0.85rem] font-semibold tracking-[1px] bg-apex-accent text-bg transition-all hover:bg-[#e0ff33] hover:-translate-y-[1px]">
                    JOIN APEX
                </Link>
            </div>
        </nav>
    )
}
