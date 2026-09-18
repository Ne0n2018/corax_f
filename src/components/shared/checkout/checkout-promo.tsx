'use client'

import React, { useState } from 'react'
import { Tag, Check, X, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface CheckoutPromoProps {
    subtotal: number
    appliedCode: string
    promoDiscount: number
    onApplyPromo: (code: string, discountAmount: number) => void
    onRemovePromo: () => void
}

export function CheckoutPromo({
    subtotal,
    appliedCode,
    promoDiscount,
    onApplyPromo,
    onRemovePromo,
}: CheckoutPromoProps) {
    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenInput, setIsOpenInput] = useState(false)

    const handleApply = async () => {
        if (!code.trim()) return

        setIsLoading(true)
        try {
            const response = await api.get<any>(
                `/promo-codes/validate/${encodeURIComponent(code.trim())}`,
                {
                    params: { subtotal },
                }
            )

            const data = response.data
            // Проверяем результат
            if (data && (data.discountAmount !== undefined || data.discountPercent !== undefined)) {
                let calculatedDiscount = 0
                if (data.discountAmount) {
                    calculatedDiscount = Number(data.discountAmount)
                } else if (data.discountPercent) {
                    calculatedDiscount = (subtotal * Number(data.discountPercent)) / 100
                }
                onApplyPromo(code.trim(), calculatedDiscount)
                toast.success('Промокод успешно применен!')
                setCode('')
                setIsOpenInput(false)
            } else {
                toast.error('Промокод недействителен или срок его действия истек')
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Неверный промокод'
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                Промокод
            </h4>

            {appliedCode ? (
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <div>
                            <span className="text-xs sm:text-sm font-bold text-emerald-800">
                                {appliedCode}
                            </span>
                            {promoDiscount > 0 && (
                                <span className="text-xs text-emerald-600 ml-2">
                                    (-{promoDiscount.toFixed(2)} р.)
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRemovePromo}
                        className="text-gray-400 hover:text-black transition-colors p-1 rounded-full cursor-pointer"
                        aria-label="Удалить промокод"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : isOpenInput ? (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Введите промокод..."
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm uppercase tracking-wider text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D83C2D] focus:ring-1 focus:ring-[#D83C2D]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleApply()
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={isLoading || !code.trim()}
                            className="px-4 py-2.5 bg-[#D83C2D] hover:bg-[#c23325] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-24"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Применить'
                            )}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpenInput(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer pl-1"
                    >
                        Отмена
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpenInput(true)}
                    className="w-full py-3 px-4 border border-gray-200 hover:border-gray-300 rounded-2xl text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-all bg-white shadow-2xs text-center cursor-pointer"
                >
                    Применить промокод
                </button>
            )}
        </div>
    )
}
