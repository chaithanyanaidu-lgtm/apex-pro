'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Dumbbell,
    Utensils,
    TrendingUp,
    ShieldAlert,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react'

const navItems = [
    { name: 'OVERVIEW', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard' },
    { name: 'WORKOUTS', icon: <Dumbbell className="w-4 h-4" />, href: '/dashboard/workouts' },
    { name: 'NUTRITION', icon: <Utensils className="w-4 h-4" />, href: '/dashboard/nutrition' },
    { name: 'PROGRESS', icon: <TrendingUp className="w-4 h-4" />, href: '/dashboard/progress' },
    { name: 'ELITE FORGE', icon: <ShieldAlert className="w-4 h-4 text-apex-accent" />, href: '/dashboard/forge' },
    { name: 'SETTINGS', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (!supabase) return
        supabase.auth.getUser().then(({ data }: any) => {
            if (data?.user) {
                setUser(data.user)
            }
        })
    }, [])

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    const handleLogout = async () => {
        if (supabase) {
            try { await supabase.auth.signOut() } catch { /* ignore */ }
        }
        router.push('/')
    }

    const initials = user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'A'

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-[200] lg:hidden w-10 h-10 bg-surface border border-border-main flex items-center justify-center text-apex-accent hover:bg-card transition-colors cursor-pointer"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-60 bg-surface border-r border-border-main flex flex-col z-[300]
                transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between p-6 border-b border-border-main">
                    <div className="sb-logo font-display text-2xl text-apex-accent tracking-[3px]">
                        APEX
                    </div>
                    {/* Close button (mobile only) */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center text-apex-muted hover:text-apex-accent transition-colors cursor-pointer"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="sb-user flex items-center gap-3 p-[18px_24px] border-b border-border-main">
                    <div className="w-[38px] h-[38px] rounded-full bg-apex-accent flex items-center justify-center font-display text-lg text-bg shrink-0">
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-[0.88rem] font-semibold truncate text-apex-text">
                            {user?.user_metadata?.full_name || 'ATHLETE'}
                        </div>
                        <div className="text-[0.7rem] text-apex-accent font-mono mt-0.5">
                            PRO MEMBER
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-3 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-[13px] text-[0.85rem] transition-all border-l-[3px] ${pathname === item.href
                                ? 'text-apex-accent bg-apex-accent/5 border-apex-accent'
                                : 'text-apex-muted hover:text-apex-text hover:bg-white/5 border-transparent'
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border-main">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-apex-dim text-[0.82rem] transition-colors hover:text-apex-danger cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" /> LOGOUT SYSTEM
                    </button>
                </div>
            </aside>
        </>
    )
}
