'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PackageCheck, RefreshCw, ShoppingBag, TriangleAlert } from 'lucide-react'
import { useOrderStore } from '@/store/order.store'
import { COMPLETED_ORDER_STATUSES, getOrderStatusInfo, OrderResponse } from '@/types/order'
import { cn } from '@/lib/utils'

interface PurchasesWindowProps {
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

function formatDate(value?: string): string {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function PurchaseCard({ order }: { order: OrderResponse }) {
    const router = useRouter()
    const { repeatOrder, repeatingOrderId } = useOrderStore()
    const [isExpanded, setIsExpanded] = useState(false)

    const isRepeating = repeatingOrderId === order.id
    const statusInfo = getOrderStatusInfo(order.status)
    const items = order.items || []
    const visibleItems = isExpanded ? items : items.slice(0, 3)

    const handleRepeat = async () => {
        const success = await repeatOrder(order)
        if (success) {
            router.push('/cart')
        }
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm sm:text-base">
                            Заказ № {formatOrderCode(order.orderCode, order.id)}
                        </span>
                        <span
                            className={cn(
                                'px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold',
                                statusInfo.className,
                            )}
                        >
                            {statusInfo.label}
                        </span>
                    </div>
                    {order.createdAt && (
                        <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                            Оформлен {formatDate(order.createdAt)}
                        </p>
                    )}
                </div>

                <div className="text-right shrink-0">
                    <div className="text-white font-bold text-sm sm:text-base">
                        {Number(order.totalAmount || 0).toFixed(2)} р.
                    </div>
                    {items.length > 0 && (
                        <div className="text-[#8E8E93] text-xs">Позиций: {items.length}</div>
                    )}
                </div>
            </div>

            {/* Состав заказа */}
            {items.length > 0 && (
                <div className="mt-4 space-y-2">
                    {visibleItems.map((item, index) => {
                        const productUrl = item.productId ? `/catalog/${item.productId}` : '#'

                        return (
                            <Link
                                key={item.id || index}
                                href={productUrl}
                                className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-11 h-11 shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.productName || 'Товар'}
                                            className="max-h-full max-w-full object-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <PackageCheck className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-white text-xs sm:text-sm font-medium truncate">
                                        {item.productName}
                                    </p>
                                    <p className="text-[#8E8E93] text-[11px] sm:text-xs">
                                        {item.quantity} шт.
                                        {item.taste ? ` • ${item.taste}` : ''}
                                        {item.size ? ` • ${item.size}` : ''}
                                    </p>
                                </div>

                                <span className="text-white text-xs sm:text-sm font-semibold shrink-0">
                                    {(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)} р.
                                </span>
                            </Link>
                        )
                    })}

                    {items.length > 3 && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="text-[#8E8E93] hover:text-white text-xs sm:text-sm transition-colors cursor-pointer"
                        >
                            {isExpanded ? 'Свернуть' : `Показать ещё (${items.length - 3})`}
                        </button>
                    )}
                </div>
            )}

            <div className="mt-4">
                <button
                    type="button"
                    onClick={handleRepeat}
                    disabled={isRepeating}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D83C2D] text-white text-xs sm:text-sm font-medium hover:bg-[#c43224] transition-colors cursor-pointer disabled:opacity-60"
                >
                    <RefreshCw className={cn('w-4 h-4', isRepeating && 'animate-spin')} />
                    {isRepeating ? 'Добавляем в корзину...' : 'Повторить заказ'}
                </button>
            </div>
        </div>
    )
}

export function PurchasesWindow({ className }: PurchasesWindowProps) {
    const { orders, isLoadingOrders, error, getUserOrders } = useOrderStore()

    useEffect(() => {
        getUserOrders()
    }, [getUserOrders])

    // На этой странице — только завершённые заказы
    const completedOrders = orders.filter((order) => COMPLETED_ORDER_STATUSES.includes(order.status))

    return (
        <div className={cn('p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-[500px]', className)}>
            <div className="mb-6">
                <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">Ваши покупки</h2>
                <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                    Завершённые заказы: любой можно повторить в один клик
                </p>
            </div>

            {/* Загрузка */}
            {isLoadingOrders && (
                <div className="space-y-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="animate-pulse bg-[#3A3A40] rounded-2xl h-36" />
                    ))}
                </div>
            )}

            {/* Ошибка загрузки */}
            {!isLoadingOrders && error && completedOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-[#D83C2D]">
                        <TriangleAlert className="w-12 h-12" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                        Не удалось загрузить покупки
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-sm">{error}</p>
                    <button
                        type="button"
                        onClick={() => getUserOrders()}
                        className="px-5 py-2.5 rounded-xl bg-[#D83C2D] text-white text-xs sm:text-sm font-medium hover:bg-[#c43224] transition-colors cursor-pointer"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {/* Пусто */}
            {!isLoadingOrders && !error && completedOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-gray-400">
                        <PackageCheck className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            Завершённых заказов пока нет
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                            Здесь появятся доставленные заказы, и любой из них можно будет повторить
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

            {/* Список покупок */}
            {!isLoadingOrders && completedOrders.length > 0 && (
                <div className="space-y-4">
                    {completedOrders.map((order) => (
                        <PurchaseCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}
