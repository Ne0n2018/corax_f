'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useOrderStore } from '@/store/order.store'
import { DeliveryType, OrderResponse } from '@/types/order'
import { ChevronLeft, ChevronRight, Package, PackageSearch, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrdersWindowProps {
    className?: string
}

// Форматирование 6-значного кода заказа: 483920 -> "483 920"
function formatOrderCode(orderCode?: number | null, fallbackId?: string): string {
    if (orderCode && Number.isFinite(orderCode)) {
        const str = orderCode.toString()
        if (str.length === 6) {
            return `${str.slice(0, 3)} ${str.slice(3)}`
        }
        return str
    }
    return fallbackId ? fallbackId.slice(0, 6).toUpperCase() : ''
}

// Вычисление расчетной даты доставки / статуса
function getArrivalHeading(order: OrderResponse): string {
    if (order.status === 'DELIVERED') {
        const date = new Date(order.createdAt || Date.now())
        return `Доставлен ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`
    }
    if (order.status === 'CANCELLED') {
        return 'Заказ отменен'
    }

    const created = new Date(order.createdAt || Date.now())
    const now = new Date()
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)

    // Если самовывоз
    if (order.deliveryType === DeliveryType.PICKUP) {
        return order.status === 'SHIPPED' ? 'Готов к выдаче' : 'Прибудет сегодня'
    }

    // Если курьер (обычно на следующий день)
    if (order.deliveryType === DeliveryType.DELIVERY) {
        if (diffHours < 24) {
            return 'Прибудет завтра'
        }
        const arrivalDate = new Date(created.getTime() + 24 * 60 * 60 * 1000)
        return `Прибудет ${arrivalDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`
    }

    // Европочта или Белпочта (2-3 дня)
    const arrivalDate = new Date(created.getTime() + 2 * 24 * 60 * 60 * 1000)
    return `Прибудет ${arrivalDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`
}

// Текст и стили плашки статуса в карточке товара
function getStatusBadge(status: string) {
    switch (status) {
        case 'SHIPPED':
            return {
                text: 'Заказ в пути',
                className: 'bg-[#E5E5EA] text-[#3A3A3C] hover:bg-[#DCDCE2]',
            }
        case 'PROCESSING':
            return {
                text: 'Собирается',
                className: 'bg-[#E5E5EA] text-[#3A3A3C]',
            }
        case 'PAID':
            return {
                text: 'В обработке',
                className: 'bg-[#E5E5EA] text-[#3A3A3C]',
            }
        case 'PENDING':
            return {
                text: 'Ожидает оплаты',
                className: 'bg-amber-100 text-amber-900',
            }
        case 'DELIVERED':
            return {
                text: 'Доставлен',
                className: 'bg-emerald-100 text-emerald-900',
            }
        case 'CANCELLED':
            return {
                text: 'Отменен',
                className: 'bg-gray-200 text-gray-500',
            }
        default:
            return {
                text: 'Заказ в пути',
                className: 'bg-[#E5E5EA] text-[#3A3A3C]',
            }
    }
}

// Компонент горизонтальной карусели для товаров одного заказа
function OrderCarousel({ order }: { order: OrderResponse }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const checkScroll = () => {
        if (!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 10)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [order.items])

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return
        const offset = direction === 'left' ? -260 : 260
        scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
        setTimeout(checkScroll, 300)
    }

    const items = order.items || []
    if (items.length === 0) return null

    const statusBadge = getStatusBadge(order.status)
    const arrivalHeading = getArrivalHeading(order)
    const orderCodeText = formatOrderCode(order.orderCode, order.id)

    return (
        <div className="space-y-2.5">
            {/* Заголовок заказа: Прибудет... № 483 920 */}
            <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm sm:text-base">
                    {arrivalHeading}
                </span>
                <span className="text-[#8E8E93] font-medium text-xs sm:text-sm">
                    № {orderCodeText}
                </span>
            </div>

            {/* Контейнер карусели с кнопками навигации */}
            <div className="relative group/carousel">
                {/* Стрелка влево */}
                {canScrollLeft && (
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white text-gray-800 shadow-md flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
                        aria-label="Назад"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Горизонтальный скролл-контейнер */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-3.5 overflow-x-auto scrollbar-none scroll-smooth py-1 px-0.5"
                >
                    {items.map((item, index) => {
                        const productUrl = item.productId ? `/catalog/${item.productId}` : '#'
                        const priceText = item.price ? `от ${item.price.toFixed(2)} р.` : '55.00 р.'

                        return (
                            <div
                                key={item.id || index}
                                className="bg-white rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between w-[210px] sm:w-[230px] shrink-0 border border-transparent shadow-xs transition-transform hover:-translate-y-0.5"
                            >
                                {/* Картинка товара */}
                                <Link
                                    href={productUrl}
                                    className="relative w-full h-[140px] flex items-center justify-center bg-white rounded-xl overflow-hidden group"
                                >
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.productName || 'Товар'}
                                            className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                            <Package className="w-10 h-10" />
                                        </div>
                                    )}
                                </Link>

                                {/* Данные о товаре */}
                                <div className="mt-2.5">
                                    <div className="font-bold text-gray-900 text-sm sm:text-base leading-none">
                                        {priceText}
                                    </div>
                                    <Link
                                        href={productUrl}
                                        className="text-xs text-gray-700 font-medium line-clamp-2 mt-1.5 min-h-[32px] leading-snug hover:text-black transition-colors"
                                        title={item.productName}
                                    >
                                        {item.productName}
                                        {item.taste ? ` (${item.taste})` : ''}
                                        {item.size ? ` ${item.size}` : ''}
                                    </Link>
                                </div>

                                {/* Плашка статуса заказа */}
                                <div
                                    className={cn(
                                        'w-full py-2 px-3 rounded-xl text-center text-xs font-semibold mt-3 transition-colors select-none',
                                        statusBadge.className
                                    )}
                                >
                                    {statusBadge.text}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Стрелка вправо */}
                {canScrollRight && (
                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white text-gray-800 shadow-md flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
                        aria-label="Вперед"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    )
}

export function OrdersWindow({ className }: OrdersWindowProps) {
    const { orders, isLoadingOrders, getUserOrders } = useOrderStore()

    useEffect(() => {
        getUserOrders()
    }, [getUserOrders])

    return (
        <div className={cn('p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-[500px]', className)}>
            {/* Заголовок раздела */}
            <div className="mb-6">
                <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">
                    Ваши заказы
                </h2>
                <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                    Следите за статусом и историей заказов в любое время
                </p>
            </div>

            {/* Состояние загрузки */}
            {isLoadingOrders && (
                <div className="space-y-6">
                    {[1, 2].map((n) => (
                        <div key={n} className="space-y-2.5 animate-pulse">
                            <div className="h-5 bg-[#3A3A40] rounded w-48" />
                            <div className="flex gap-3.5 overflow-hidden">
                                {[1, 2, 3].map((m) => (
                                    <div
                                        key={m}
                                        className="bg-[#3A3A40] rounded-[20px] h-[240px] w-[220px] shrink-0"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Пустое состояние */}
            {!isLoadingOrders && orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-gray-400">
                        <PackageSearch className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            У вас пока нет активных заказов
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                            Здесь будут отображаться ваши покупки и статус их доставки
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D83C2D] text-white font-medium text-xs sm:text-sm hover:bg-[#c43224] transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Перейти в каталог
                    </Link>
                </div>
            )}

            {/* Список заказов с каруселями */}
            {!isLoadingOrders && orders.length > 0 && (
                <div className="space-y-7">
                    {orders.map((order) => (
                        <OrderCarousel key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}
