'use client'

import React from 'react'
import { PaymentType } from '@/types/order'
import { CreditCard, Banknote } from 'lucide-react'

interface CheckoutPaymentProps {
    paymentType: PaymentType
    onSelectPaymentType: (type: PaymentType) => void
}

export function CheckoutPayment({
    paymentType,
    onSelectPaymentType,
}: CheckoutPaymentProps) {
    const isOnline = paymentType === PaymentType.ONLINE
    // При получении поддерживается как наличные (CASH), так и картой курьеру (CARD)

    return (
        <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                Оплата заказа
            </h4>

            {/* Переключатель способа оплаты: Сразу | При получении */}
            <div className="bg-white rounded-2xl p-1.5 border border-gray-200 grid grid-cols-2 gap-1 shadow-2xs">
                <button
                    type="button"
                    onClick={() => onSelectPaymentType(PaymentType.ONLINE)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isOnline
                            ? 'bg-[#D83C2D] text-white shadow-xs'
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    <CreditCard className="w-3.5 h-3.5 shrink-0" />
                    <span>Сразу</span>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectPaymentType(PaymentType.CASH)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        !isOnline
                            ? 'bg-[#D83C2D] text-white shadow-xs'
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    <Banknote className="w-3.5 h-3.5 shrink-0" />
                    <span>При получении</span>
                </button>
            </div>

            {/* Информационная подсказка по выбранному способу */}
            <p className="text-[11px] text-gray-400 pl-1">
                {isOnline
                    ? 'Безопасная онлайн-оплата банковской картой через платежную систему'
                    : 'Оплата наличными или банковской картой при получении заказа'}
            </p>
        </div>
    )
}
