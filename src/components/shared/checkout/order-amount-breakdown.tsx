'use client'

import React from 'react'
import { getOrderAmounts, OrderResponse } from '@/types/order'
import { formatMoney } from '@/lib/delivery-cost'
import { cn } from '@/lib/utils'

interface OrderAmountBreakdownProps {
    order: OrderResponse
    /** Светлая карточка (страницы оплаты) или тёмная (личный кабинет) */
    tone?: 'light' | 'dark'
    totalLabel?: string
    className?: string
}

/**
 * Раскладка итога заказа строго из полей ответа сервера:
 * subtotalAmount → discountAmount → deliveryCost → totalAmount.
 * Локально здесь ничего не пересчитывается.
 */
export function OrderAmountBreakdown({
    order,
    tone = 'light',
    totalLabel = 'К оплате',
    className,
}: OrderAmountBreakdownProps) {
    const { subtotal, discount, delivery, total } = getOrderAmounts(order)

    const isDark = tone === 'dark'
    const rowLabel = isDark ? 'text-[#8E8E93]' : 'text-gray-500'
    const rowValue = isDark ? 'text-white' : 'text-gray-900'
    const divider = isDark ? 'border-white/10' : 'border-gray-200/60'

    return (
        <div className={cn('space-y-1.5 text-xs sm:text-sm', className)}>
            <div className="flex items-center justify-between">
                <span className={rowLabel}>Товары</span>
                <span className={cn('font-semibold', rowValue)}>{formatMoney(subtotal)}</span>
            </div>

            {Number(discount) > 0 && (
                <div className="flex items-center justify-between">
                    <span className={rowLabel}>Скидка</span>
                    <span className={cn('font-semibold', isDark ? 'text-[#EC5B4D]' : 'text-[#D83C2D]')}>
                        −{formatMoney(discount)}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <span className={rowLabel}>Доставка</span>
                <span className={cn('font-semibold', rowValue)}>
                    {Number(delivery) > 0 ? formatMoney(delivery) : 'Бесплатно'}
                </span>
            </div>

            <div
                className={cn(
                    'flex items-center justify-between pt-2 mt-1 border-t',
                    divider,
                )}
            >
                <span className={cn('font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                    {totalLabel}
                </span>
                <span
                    className={cn(
                        'font-black',
                        isDark ? 'text-[#EC5B4D]' : 'text-gray-900',
                        'text-sm sm:text-base',
                    )}
                >
                    {formatMoney(total)}
                </span>
            </div>
        </div>
    )
}
