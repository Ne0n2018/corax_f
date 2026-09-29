'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useOrderStore } from '@/store/order.store'
import {
    ACTIVE_ORDER_STATUSES,
    DeliveryType,
    getOrderStatusInfo,
    isOrderUnpaid,
    OrderResponse,
} from '@/types/order'
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Loader2,
    Package,
    PackageSearch,
    ShoppingBag,
    TriangleAlert,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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

// Панель действий для неоплаченного заказа: отмена и повторная оплата
function OrderActions({ order }: { order: OrderResponse }) {
    const { cancelOrder, getPaymentUrl, cancellingOrderId } = useOrderStore()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isGettingUrl, setIsGettingUrl] = useState(false)

    const isCancelling = cancellingOrderId === order.id

    const handleCancel = async () => {
        setIsConfirmOpen(false)
        await cancelOrder(order.id)
    }

    const handleGetPaymentUrl = async () => {
        setIsGettingUrl(true)
        try {
            const redirectUrl = await getPaymentUrl(order.id)
            if (redirectUrl) {
                window.location.href = redirectUrl
                return
            }
        } finally {
            setIsGettingUrl(false)
        }
    }

    const isBusy = isCancelling || isGettingUrl

    return (
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center pt-1">
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogTrigger
                    render={
                        <button
                            type="button"
                            disabled={isBusy}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                        />
                    }
                >
                    <X className="w-4 h-4" />
                    Отменить заказ
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#2C2C31] text-white border-white/10 rounded-[20px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Отменить заказ № {formatOrderCode(order.orderCode, order.id)}?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Заказ будет отменен, а товары вернутся в каталог. Это действие нельзя отменить.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 text-white border-white/15 hover:bg-white/10 hover:text-white">
                            Оставить заказ
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancel}
                            className="bg-[#D83C2D] text-white hover:bg-[#c43224]"
                        >
                            Да, отменить
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <button
                type="button"
                onClick={handleGetPaymentUrl}
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D83C2D] text-white text-xs sm:text-sm font-medium hover:bg-[#c43224] transition-colors cursor-pointer disabled:opacity-50"
            >
                {isGettingUrl ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <CreditCard className="w-4 h-4" />
                )}
                Получить ссылку на оплату
            </button>
        </div>
    )
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

    const statusBadge = getOrderStatusInfo(order.status)
    const arrivalHeading = getArrivalHeading(order)
    const orderCodeText = formatOrderCode(order.orderCode, order.id)
    const unpaid = isOrderUnpaid(order.status)

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
                                    {statusBadge.label}
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

            {/* Действия доступны только для неоплаченного заказа */}
            {unpaid && <OrderActions order={order} />}
        </div>
    )
}

export function OrdersWindow({ className }: OrdersWindowProps) {
    const { orders, isLoadingOrders, error, getUserOrders } = useOrderStore()

    useEffect(() => {
        getUserOrders()
    }, [getUserOrders])

    // На этой странице — только заказы, которые ещё в работе
    const activeOrders = orders.filter((order) => ACTIVE_ORDER_STATUSES.includes(order.status))

    return (
        <div className={cn('p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-[500px]', className)}>
            {/* Заголовок раздела */}
            <div className="mb-6">
                <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">
                    Ваши заказы
                </h2>
                <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                    Заказы в работе: оплата, сборка и доставка
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

            {/* Ошибка загрузки */}
            {!isLoadingOrders && error && activeOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-[#D83C2D]">
                        <TriangleAlert className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            Не удалось загрузить заказы
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">{error}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => getUserOrders()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D83C2D] text-white font-medium text-xs sm:text-sm hover:bg-[#c43224] transition-colors cursor-pointer"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {/* Пустое состояние */}
            {!isLoadingOrders && !error && activeOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-gray-400">
                        <PackageSearch className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            У вас пока нет активных заказов
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                            Здесь будут отображаться заказы в работе и статус их доставки
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
            {!isLoadingOrders && activeOrders.length > 0 && (
                <div className="space-y-7">
                    {activeOrders.map((order) => (
                        <OrderCarousel key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}
