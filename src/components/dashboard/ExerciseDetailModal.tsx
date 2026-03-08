'use client'

import { X } from 'lucide-react'
import { ExerciseDetail } from '@/lib/workout-schedule'

interface ExerciseDetailModalProps {
    exercise: ExerciseDetail | null
    onClose: () => void
}

export default function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
    if (!exercise) return null

    const difficultyColor = {
        Beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
        Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
        Advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-card border border-border-main mx-4 mb-4 sm:mb-0 animate-slide-up overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-0">
                    <div>
                        <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-1">EXERCISE DETAILS</div>
                        <h3 className="font-display text-[1.5rem] tracking-[1px] uppercase">{exercise.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-surface border border-border-main hover:border-apex-accent hover:text-apex-accent transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-[0.65rem] font-mono px-2.5 py-1 bg-apex-accent/10 text-apex-accent border border-apex-accent/20 uppercase tracking-wider">
                            {exercise.targetMuscle}
                        </span>
                        <span className={`text-[0.65rem] font-mono px-2.5 py-1 border uppercase tracking-wider ${difficultyColor[exercise.difficulty]}`}>
                            {exercise.difficulty}
                        </span>
                    </div>

                    {/* Instructions */}
                    <div>
                        <div className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px] mb-2.5">HOW TO PERFORM</div>
                        <div className="space-y-2">
                            {exercise.instructions.map((step, i) => (
                                <div key={i} className="flex gap-3 text-[0.82rem]">
                                    <span className="font-mono text-apex-accent text-[0.7rem] mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-apex-text/90">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variations */}
                    {exercise.variations.length > 0 && (
                        <div>
                            <div className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px] mb-2.5">VARIATIONS</div>
                            <div className="grid grid-cols-1 gap-1.5">
                                {exercise.variations.map((v, i) => (
                                    <div key={i} className="flex justify-between items-center p-2.5 bg-surface border border-border-main">
                                        <span className="text-[0.82rem] font-medium">{v.name}</span>
                                        <span className={`text-[0.6rem] font-mono px-2 py-0.5 border uppercase ${difficultyColor[v.difficulty]}`}>
                                            {v.difficulty}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
