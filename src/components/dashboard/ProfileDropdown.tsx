'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProfileDropdownProps {
    userName: string
}

export default function ProfileDropdown({ userName }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'

    // Close on click-outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const handleLogout = async () => {
        if (supabase) {
            try { await supabase.auth.signOut() } catch { /* ignore */ }
        }
        localStorage.removeItem('apex_athlete_profile')
        router.push('/')
    }

    return (
        <div ref={dropdownRef} className="relative">
            {/* Profile Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-apex-accent flex items-center justify-center font-display text-lg text-bg hover:scale-105 transition-transform cursor-pointer"
                aria-label="Profile menu"
            >
                {initials}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-12 w-56 bg-card border border-border-main shadow-2xl animate-scale-in z-[150]">
                    {/* User Info */}
                    <div className="p-4 border-b border-border-main">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-apex-accent/20 text-apex-accent flex items-center justify-center font-display text-sm">
                                {initials}
                            </div>
                            <div>
                                <div className="text-[0.85rem] font-semibold truncate">{userName}</div>
                                <div className="text-[0.65rem] font-mono text-apex-accent">PRO MEMBER</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="py-1.5">
                        <Link
                            href="/dashboard/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[0.82rem] text-apex-muted hover:text-apex-text hover:bg-white/5 transition-all"
                        >
                            <User className="w-4 h-4" />
                            View Profile
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[0.82rem] text-apex-muted hover:text-apex-text hover:bg-white/5 transition-all"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>

                    <div className="border-t border-border-main py-1.5">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.82rem] text-apex-danger hover:bg-apex-danger/5 transition-all cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
