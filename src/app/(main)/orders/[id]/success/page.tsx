'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { useOrderStore } from '@/store/order.store'
import { useCartStore } from '@/store/cart.store'
import { OrderResponse, DeliveryType } from '@/types/order'
import { CheckCircle2, Package, MapPin, CreditCard, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'

export default function OrderSuccessPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = React.use(params)
    const orderId = resolvedParams.id

    const { getOrder } = useOrderStore()
    const { getCart } = useCartStore()
    const [order, setOrder] = useState<OrderResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Очищаем/синхронизируем корзину после успешной оплаты
        getCart()

        const fetchOrder = async () => {
            setIsLoading(true)
            const data = await getOrder(orderId)
            setOrder(data)
            setIsLoading(false)
        }

        if (orderId) {
            fetchOrder()
        }
    }, [orderId, getOrder, getCart])

    const getDeliveryLabel = (type?: DeliveryType) => {
        switch (type) {
            case DeliveryType.PICKUP:
                return 'Самовывоз из магазина'
            case DeliveryType.EUROMAIL:
                return 'Доставка Европочтой'
            case DeliveryType.DELIVERY:
            default:
                return 'Курьерская доставка'
        }
    }

    if (isLoading) {
        return (
            <Container className="py-20 flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-[#D83C2D] animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-500">Проверяем статус оплаты...</p>
            </Container>
        )
    }

    const orderNumber = order?.orderCode || orderId.slice(0, 8)

    return (
        <Container className="py-10 sm:py-16 max-w-2xl">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6 text-center animate-fadeIn">
                {/* Иконка успеха */}
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>

                {/* Заголовки */}
                <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 bg-emerald-100/60 text-emerald-800 text-xs font-bold rounded-full mb-1">
                        Оплата получена
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Заказ успешно оплачен!
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Заказ <span className="font-bold text-gray-900">№{orderNumber}</span> принят в обработку.
                        Чек и подтверждение отправлены вам на email.
                    </p>
                </div>

                {/* Детали заказа */}
                {order && (
                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-left border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                            <span className="text-xs sm:text-sm text-gray-500 font-medium">Сумма оплаты</span>
                            <span className="text-base sm:text-lg font-black text-gray-900">
                                {Number(order.totalAmount).toFixed(2)} р.
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                            <div className="flex items-start gap-2.5">
                                <CreditCard className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-400 text-[11px]">Способ оплаты</p>
                                    <p className="font-semibold text-gray-800">Онлайн через bePaid</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Package className="w-4 h-4 text-[#D83C2D] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-gray-400 text-[11px]">Способ доставки</p>
                                    <p className="font-semibold text-gray-800">
                                        {getDeliveryLabel(order.deliveryType)}
                                    </p>
                                </div>
                            </div>

                            {order.address && (
                                <div className="sm:col-span-2 flex items-start gap-2.5 pt-1">
                                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-gray-400 text-[11px]">Адрес получения</p>
                                        <p className="font-semibold text-gray-800">{order.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Состав заказа, если есть */}
                        {order.items && order.items.length > 0 && (
                            <div className="pt-3 border-t border-gray-200/60 space-y-2">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    Товары в заказе ({order.items.length})
                                </p>
                                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-100"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {item.imageUrl ? (
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.productName}
                                                        width={36}
                                                        height={36}
                                                        className="rounded-lg object-contain bg-white"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 text-left">
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400">
                                                        {item.quantity} шт. {item.taste ? `• ${item.taste}` : ''} {item.size ? `• ${item.size}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-900 shrink-0 pl-2">
                                                {(item.price * item.quantity).toFixed(2)} р.
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Кнопки действий */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/catalog"
                        className="px-6 py-3.5 bg-[#D83C2D] hover:bg-[#c23325] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 text-center"
                    >
                        <span>Продолжить покупки</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/account"
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-xs sm:text-sm transition-all text-center"
                    >
                        В личный кабинет
                    </Link>
                </div>
            </div>
        </Container>
    )
}
