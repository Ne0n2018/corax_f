'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface CheckoutSummaryProps {
    subtotal: number
    discount: number
    deliveryPrice: number
    totalQuantity: number
    isSubmitting: boolean
    canSubmit: boolean
    onSubmit: () => void
}

export function CheckoutSummary({
    subtotal,
    discount,
    deliveryPrice,
    totalQuantity,
    isSubmitting,
    canSubmit,
    onSubmit,
}: CheckoutSummaryProps) {
    const finalTotal = Math.max(0, subtotal - discount) + deliveryPrice

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Итоговая сумма крупно */}
            <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                    Итого
                </span>
                <span className="text-xl sm:text-2xl font-black text-gray-900">
                    {finalTotal.toFixed(2)} р.
                </span>
            </div>

            {/* Детализация строк */}
            <div className="space-y-1.5 text-xs sm:text-sm text-gray-800">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Количество товаров</span>
                    <span className="font-semibold text-gray-900">
                        {totalQuantity} {totalQuantity === 1 ? 'товар' : totalQuantity < 5 ? 'товара' : 'товаров'}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Сумма за товары</span>
                    <span className="font-semibold text-gray-900">
                        {subtotal.toFixed(2)} р.
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Скидка</span>
                    <span className={`font-semibold ${discount > 0 ? 'text-[#D83C2D]' : 'text-gray-900'}`}>
                        {discount > 0 ? `-${discount.toFixed(2)} р.` : '0%'}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Доставка</span>
                    <span className="font-semibold text-gray-900">
                        {deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toFixed(2)} р.`}
                    </span>
                </div>
            </div>

            {/* Кнопка оформления заказа */}
            <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit || isSubmitting}
                className="w-full bg-[#D83C2D] hover:bg-[#c23325] text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-center"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Оформление...</span>
                    </>
                ) : (
                    <span>Приобрести товар</span>
                )}
            </button>
        </div>
    )
}
