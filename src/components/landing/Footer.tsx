'use client'

export default function Footer() {
    return (
        <footer className="land-footer flex flex-col md:flex-row justify-between items-center py-9 px-6 md:px-[60px] border-t border-border-main gap-4">
            <div className="logo-mark font-display text-xl tracking-[4px] text-apex-accent opacity-50">
                APEX
            </div>
            <p className="text-[0.8rem] text-apex-dim">
                © {new Date().getFullYear()} APEX PERFORMANCE SYSTEMS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-apex-dim text-xs tracking-widest hover:text-apex-text transition-colors">PRIVACY</a>
                <a href="#" className="text-apex-dim text-xs tracking-widest hover:text-apex-text transition-colors">TERMS</a>
                <a href="#" className="text-apex-dim text-xs tracking-widest hover:text-apex-text transition-colors">SUPPORT</a>
            </div>
        </footer>
    )
}
