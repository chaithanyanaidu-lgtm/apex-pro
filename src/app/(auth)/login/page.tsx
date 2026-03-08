'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Mock Authentication since Supabase cloud project is currently inactive
        setTimeout(() => {
            if (email && password) {
                window.location.href = '/dashboard'
            } else {
                setError("Please enter valid credentials")
                setLoading(false)
            }
        }, 300)
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg text-apex-text overflow-hidden">
            {/* Brand Panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-border-main bg-surface">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_110%,rgba(200,255,0,0.07),transparent)]" />
                <div className="relative z-10 logo-mark font-display text-2xl tracking-[4px] text-apex-accent">
                    APEX
                </div>
                <div className="relative z-10">
                    <h1 className="font-display text-[64px] leading-[0.92] uppercase">
                        FORGE YOUR <br /><em className="text-apex-accent not-italic">APEX</em>
                    </h1>
                </div>
                <div className="relative z-10 flex gap-9">
                    <div>
                        <div className="font-display text-[2.4rem] text-apex-accent">5.0</div>
                        <div className="text-[0.65rem] tracking-[2px] text-apex-muted uppercase">SYSTEM RATING</div>
                    </div>
                    <div>
                        <div className="font-display text-[2.4rem] text-apex-accent">100%</div>
                        <div className="text-[0.65rem] tracking-[2px] text-apex-muted uppercase">SECURE TUNNEL</div>
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-14 bg-bg overflow-y-auto">
                <div className="w-full max-w-[400px]">
                    <Link href="/" className="auth-back flex items-center gap-2 text-apex-muted text-[0.8rem] mb-11 hover:text-apex-text transition-colors">
                        <ChevronLeft className="w-4 h-4" /> BACK TO SYSTEM
                    </Link>

                    <h2 className="font-display text-[2.8rem] tracking-[2px] mb-1.5 uppercase">SYSTEM ACCESS</h2>
                    <p className="text-apex-muted text-[0.88rem] mb-9">Enter your credentials to enter the Forge.</p>

                    <form onSubmit={handleLogin} className="space-y-[18px]">
                        <div className="form-group flex flex-col gap-1.5">
                            <label className="font-mono text-[0.65rem] tracking-[2px] text-apex-muted uppercase">EMAIL IDENTIFIER</label>
                            <input
                                type="email"
                                placeholder="athlete@apex.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-card border border-border-sub text-apex-text p-[13px_16px] text-[0.92rem] outline-none focus:border-apex-accent transition-colors"
                            />
                        </div>

                        <div className="form-group flex flex-col gap-1.5">
                            <label className="font-mono text-[0.65rem] tracking-[2px] text-apex-muted uppercase">SECURITY KEY</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-card border border-border-sub text-apex-text p-[13px_16px] text-[0.92rem] outline-none focus:border-apex-accent transition-colors"
                            />
                        </div>

                        {error && <p className="text-apex-danger text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-apex-accent text-bg p-[15px] text-[0.9rem] font-bold tracking-[2px] uppercase mt-2 transition-colors hover:bg-[#e0ff33] disabled:opacity-50"
                        >
                            {loading ? 'INITIALIZING...' : 'Login'}
                        </button>
                    </form>

                    <div className="text-center mt-[22px] text-[0.85rem] text-apex-muted">
                        NEW ATHLETE? <Link href="/signup" className="text-apex-accent hover:underline">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
