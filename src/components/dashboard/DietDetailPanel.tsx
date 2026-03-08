'use client'

import { X, Flame, Zap, Wheat, Droplets, Clock, ArrowLeftRight } from 'lucide-react'
import { FoodDetail, FOOD_ALTERNATIVES } from '@/lib/diet-engine'

interface DietDetailPanelProps {
    mealLabel: string
    mealName: string
    detail: FoodDetail | null
    onClose: () => void
    onSwapIngredient?: (original: string, replacement: string) => void
}

export default function DietDetailPanel({ mealLabel, mealName, detail, onClose, onSwapIngredient }: DietDetailPanelProps) {
    if (!detail) return null

    // Find ingredients in the meal that have alternatives
    const ingredients = Object.keys(FOOD_ALTERNATIVES).filter(key =>
        mealName.toLowerCase().includes(key.toLowerCase())
    )

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-lg bg-card border border-border-main mx-4 mb-4 sm:mb-0 animate-slide-up overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-4">
                    <div>
                        <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-accent uppercase mb-1">{mealLabel}</div>
                        <h3 className="font-display text-[1.4rem] tracking-[1px] uppercase">{mealName}</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-surface border border-border-main hover:border-apex-accent hover:text-apex-accent transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-6 pb-6 space-y-5">
                    {/* Macro Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        <div className="bg-surface border border-border-main p-3 text-center">
                            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                            <div className="font-display text-lg">{detail.calories}</div>
                            <div className="text-[0.55rem] font-mono text-apex-muted">KCAL</div>
                        </div>
                        <div className="bg-surface border border-border-main p-3 text-center">
                            <Zap className="w-4 h-4 text-green-400 mx-auto mb-1" />
                            <div className="font-display text-lg">{detail.protein}g</div>
                            <div className="text-[0.55rem] font-mono text-apex-muted">PROTEIN</div>
                        </div>
                        <div className="bg-surface border border-border-main p-3 text-center">
                            <Wheat className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                            <div className="font-display text-lg">{detail.carbs}g</div>
                            <div className="text-[0.55rem] font-mono text-apex-muted">CARBS</div>
                        </div>
                        <div className="bg-surface border border-border-main p-3 text-center">
                            <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div className="font-display text-lg">{detail.fat}g</div>
                            <div className="text-[0.55rem] font-mono text-apex-muted">FAT</div>
                        </div>
                    </div>

                    {/* Prep Time */}
                    <div className="flex items-center gap-2 text-[0.75rem] text-apex-muted">
                        <Clock className="w-3.5 h-3.5 text-apex-accent" />
                        <span className="font-mono">PREP TIME: {detail.prepTime}</span>
                    </div>

                    {/* Instructions */}
                    <div>
                        <div className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px] mb-2.5">PREPARATION</div>
                        <div className="space-y-2">
                            {detail.instructions.map((step, i) => (
                                <div key={i} className="flex gap-3 text-[0.82rem]">
                                    <span className="font-mono text-apex-accent text-[0.7rem] mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-apex-text/90">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ingredient Alternatives */}
                    {ingredients.length > 0 && (
                        <div>
                            <div className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px] mb-2.5">
                                <ArrowLeftRight className="w-3 h-3 inline mr-1.5" />
                                INGREDIENT ALTERNATIVES
                            </div>
                            <div className="space-y-2">
                                {ingredients.map(ingredient => {
                                    const altData = FOOD_ALTERNATIVES[ingredient]
                                    return (
                                        <div key={ingredient} className="bg-surface border border-border-main p-3">
                                            <div className="text-[0.72rem] font-semibold text-apex-text mb-1.5">{ingredient} unavailable?</div>
                                            <div className="text-[0.6rem] text-apex-dim mb-2">{altData.reason}</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {altData.alternatives.map((alt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => onSwapIngredient?.(ingredient, alt)}
                                                        className="text-[0.65rem] font-mono px-2 py-1 bg-card border border-border-main text-apex-muted hover:text-apex-accent hover:border-apex-accent/30 transition-colors cursor-pointer"
                                                    >
                                                        {alt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
