'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { useOrderStore } from '@/store/order.store'
import { OrderResponse } from '@/types/order'
import { AlertCircle, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OrderCancelPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = React.use(params)
    const orderId = resolvedParams.id

    const { getOrder, getPaymentUrl } = useOrderStore()
    const [order, setOrder] = useState<OrderResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRetrying, setIsRetrying] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true)
            const data = await getOrder(orderId)
            setOrder(data)
            setIsLoading(false)
        }

        if (orderId) {
            fetchOrder()
        }
    }, [orderId, getOrder])

    const handleRetryPayment = async () => {
        setIsRetrying(true)
        const redirectUrl = await getPaymentUrl(orderId)
        if (redirectUrl) {
            window.location.href = redirectUrl
        } else {
            setIsRetrying(false)
            toast.error('Не удалось сформировать ссылку для оплаты')
        }
    }

    if (isLoading) {
        return (
            <Container className="py-20 flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-[#D83C2D] animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-500">Загрузка информации о заказе...</p>
            </Container>
        )
    }

    const orderNumber = order?.orderCode || orderId.slice(0, 8)

    return (
        <Container className="py-10 sm:py-16 max-w-2xl">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6 text-center animate-fadeIn">
                {/* Иконка отмены */}
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <AlertCircle className="w-12 h-12 stroke-[2.5]" />
                </div>

                {/* Заголовки */}
                <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 bg-amber-100/70 text-amber-900 text-xs font-bold rounded-full mb-1">
                        Оплата отменена
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Вы отменили процесс оплаты
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Заказ <span className="font-bold text-gray-900">№{orderNumber}</span> сохранен в статусе ожидания оплаты.
                        Вы можете оплатить его в любой момент.
                    </p>
                </div>

                {/* Сумма заказа */}
                {order && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-500 font-medium">Сумма к оплате</span>
                        <span className="text-base sm:text-lg font-black text-gray-900">
                            {Number(order.totalAmount).toFixed(2)} р.
                        </span>
                    </div>
                )}

                {/* Кнопки действий */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        type="button"
                        onClick={handleRetryPayment}
                        disabled={isRetrying}
                        className="px-6 py-3.5 bg-[#D83C2D] hover:bg-[#c23325] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isRetrying ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Перенаправление...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                <span>Перейти к оплате</span>
                            </>
                        )}
                    </button>
                    <Link
                        href="/account"
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-xs sm:text-sm transition-all text-center"
                    >
                        В личный кабинет
                    </Link>
                </div>

                <div className="pt-2">
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Вернуться в каталог</span>
                    </Link>
                </div>
            </div>
        </Container>
    )
}
