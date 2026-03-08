'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [age, setAge] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [activityLevel, setActivityLevel] = useState('Moderate')
    const [dietType, setDietType] = useState('Non-Veg')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Mock Authentication since Supabase cloud project is currently inactive
        setTimeout(() => {
            if (email && password && fullName) {
                window.location.href = '/dashboard'
            } else {
                setError("Please fill out all required fields")
                setLoading(false)
            }
        }, 300)
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg text-apex-text overflow-hidden font-body">
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
                        <div className="font-display text-[2.4rem] text-apex-accent">24/7</div>
                        <div className="text-[0.65rem] tracking-[2px] text-apex-muted uppercase">ELITE SUPPORT</div>
                    </div>
                    <div>
                        <div className="font-display text-[2.4rem] text-apex-accent">128-BIT</div>
                        <div className="text-[0.65rem] tracking-[2px] text-apex-muted uppercase">ENCRYPTION</div>
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-14 bg-bg overflow-y-auto">
                <div className="w-full max-w-[440px]">
                    <Link href="/" className="auth-back flex items-center gap-2 text-apex-muted text-[0.8rem] mb-11 hover:text-apex-text transition-colors">
                        <ChevronLeft className="w-4 h-4" /> BACK TO SYSTEM
                    </Link>

                    <h2 className="font-display text-[2.8rem] tracking-[2px] mb-1.5 uppercase leading-none">JOIN THE FORGE</h2>
                    <p className="text-apex-muted text-[0.88rem] mb-9">Create your elite athlete credentials and unlock your AI diet.</p>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group flex flex-col gap-1.5">
                                <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">ATHLETE NAME</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <div className="form-group flex flex-col gap-1.5">
                                <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">EMAIL IDENTIFIER</label>
                                <input
                                    type="email"
                                    placeholder="athlete@apex.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="form-group flex flex-col gap-1.5">
                                <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">AGE</label>
                                <input
                                    type="number"
                                    placeholder="24"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <div className="form-group flex flex-col gap-1.5">
                                <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">HEIGHT (CM)</label>
                                <input
                                    type="number"
                                    placeholder="180"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    required
                                    className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <div className="form-group flex flex-col gap-1.5">
                                <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">WEIGHT (KG)</label>
                                <input
                                    type="number"
                                    placeholder="75"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    required
                                    className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group flex flex-col gap-1.5">
                                <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">ACTIVITY LEVEL</label>
                                <select
                                    value={activityLevel}
                                    onChange={(e) => setActivityLevel(e.target.value)}
                                    className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="form-group flex flex-col gap-1.5">
                                <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">DIET PREFERENCE</label>
                                <select
                                    value={dietType}
                                    onChange={(e) => setDietType(e.target.value)}
                                    className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="Non-Veg">Non-Veg</option>
                                    <option value="Veg">Pure Veg</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group flex flex-col gap-1.5">
                            <label className="font-mono text-[0.55rem] tracking-[2px] text-apex-muted uppercase">SECURITY KEY</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-card border border-border-sub text-apex-text p-[11px_14px] text-[0.9rem] outline-none focus:border-apex-accent transition-colors"
                            />
                        </div>

                        {error && <p className={`${error.includes('Account created') ? 'text-apex-info' : 'text-apex-danger'} text-[0.85rem] font-medium`}>{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-apex-accent text-bg p-[15px] text-[0.9rem] font-bold tracking-[2px] uppercase mt-2 transition-colors hover:bg-[#e0ff33] disabled:opacity-50"
                        >
                            {loading ? 'PROCESSING...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="text-center mt-[22px] text-[0.82rem] text-apex-muted">
                        ALREADY AN ATHLETE? <Link href="/login" className="text-apex-accent hover:underline">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
