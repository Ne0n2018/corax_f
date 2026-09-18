'use client'

import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from '@/components/ui/sheet'
import {useCartStore} from '@/store/cart.store'
import {useFavoriteStore} from '@/store/favorite.store'
import {useComparisonStore} from '@/store/comparison.store'
import {Loader2, Minus, MoreHorizontal, Plus, ShoppingBag, X} from 'lucide-react'
import {toast} from 'sonner'
import {useRouter} from "next/navigation";

interface CartSheetProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function CartSheet({ isOpen, onOpenChange }: CartSheetProps) {
    const {
        cart,
        isLoading,
        isUpdating,
        getCart,
        updateQuantity,
        removeFromCart,
    } = useCartStore()

    const { favoriteProductId, addToFavorite, deleteFavorite, getFavorite } = useFavoriteStore()
    const { comparisonProductIds, toggleComparison, getComparison } = useComparisonStore()

    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
    // ID товара в корзине, для которого открыто доп. меню с тремя точками
    const [activeMenuCartItemId, setActiveMenuCartItemId] = useState<string | null>(null)
    const router = useRouter()

    // Загрузка корзины, избранного и сравнения при открытии
    useEffect(() => {
        if (isOpen) {
            getCart()
            getFavorite()
            getComparison()
        }
    }, [isOpen, getCart, getFavorite, getComparison])

    const items = cart?.CartItem || []

    // По умолчанию выбираем все позиции корзины
    useEffect(() => {
        if (items.length > 0) {
            setSelectedItemIds(items.map((i) => i.id))
        } else {
            setSelectedItemIds([])
        }
    }, [items, items.length])


    const selectedItems = items.filter((item) => selectedItemIds.includes(item.id))
    const selectedTotalAmount = selectedItems.reduce(
        (acc, item) => acc + item.productItem.price * item.quantity,
        0
    )

    // Текущий товар для активного всплывающего меню трех точек
    const activeCartItem = items.find((item) => item.id === activeMenuCartItemId)
    const activeProduct = activeCartItem?.productItem.product
    const isItemFavorite = activeProduct ? favoriteProductId.includes(activeProduct.id) : false
    const isItemCompared = activeProduct ? comparisonProductIds.includes(activeProduct.id) : false
    const cartTotalItems = selectedItems.reduce((acc, item) => acc + item.quantity, 0)

    // Расчет реальной скидки из бэкенда (по акциям из promotion.service)
    const totalCartAmount = cart?.totalAmount || 0
    const serverDiscount = cart?.discountAmount || 0
    const discount = totalCartAmount > 0
        ? Math.round(((serverDiscount * selectedTotalAmount) / totalCartAmount) * 100) / 100
        : serverDiscount
    const finalAmount = Math.max(0, selectedTotalAmount - discount)

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                showCloseButton={false}
                className="w-full sm:max-w-115 fixed! inset-y-0! right-0! left-auto! h-full! flex flex-col p-0 bg-white border-l shadow-2xl z-50 overflow-hidden"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Корзина товаров</SheetTitle>
                    <SheetDescription>Список товаров в корзине</SheetDescription>
                </SheetHeader>

                {/* Шапка корзины с конфетти-точками */}
                <div className="relative text-center pt-6 pb-4 px-6 border-b border-gray-100 shrink-0">
                    {/* Кнопка закрытия для мобильной версии экрана */}
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="sm:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-600 hover:text-black transition-all cursor-pointer z-20"
                        aria-label="Закрыть корзину"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Декоративные конфетти-точки в стиле дизайна */}
                    <span className="absolute top-4 left-8 w-1.5 h-1.5 rounded-full bg-[#D83C2D]" />
                    <span className="absolute top-7 left-16 w-1 h-1 rounded-full bg-gray-400" />
                    <span className="absolute top-3 left-28 w-1 h-1 rounded-full bg-[#D83C2D]/70" />
                    <span className="absolute top-8 left-6 w-1 h-1 rounded-full bg-gray-300" />

                    <span className="absolute top-4 right-8 w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span className="absolute top-7 right-16 w-1 h-1 rounded-full bg-[#D83C2D]" />
                    <span className="absolute top-3 right-28 w-1 h-1 rounded-full bg-[#D83C2D]/70" />
                    <span className="absolute top-8 right-6 w-1 h-1 rounded-full bg-gray-300" />

                    <h2 className="text-base sm:text-lg font-bold text-gray-900 font-russo tracking-wide">
                        Корзина товаров
                    </h2>
                </div>

                {/* Список товаров */}
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
                    {isLoading && !cart ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin text-[#D83C2D]" />
                            <p className="text-xs">Загрузка корзины...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                                <ShoppingBag className="w-7 h-7" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                                Ваша корзина пуста
                            </h3>
                            <p className="text-xs text-gray-400 mb-5 max-w-xs">
                                Выберите интересующие товары в каталоге
                            </p>
                            <Link
                                href="/catalog"
                                onClick={() => onOpenChange(false)}
                                className="bg-[#D83C2D] hover:bg-[#c23325] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-2xs"
                            >
                                Перейти в каталог
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => {
                            const product = item.productItem.product
                            const isClothes = product?.isClothes

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 pb-3 shadow rounded-[20px] last:border-b-0 relative group"
                                >
                                    {/* Фото товара с маленькой круглой кнопкой удаления */}
                                    <div className="relative w-19 h-19 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 p-1 shadow-2xs">
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            disabled={isUpdating}
                                            title="Удалить из корзины"
                                            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-white border border-[#D83C2D]/30 text-[#D83C2D] hover:bg-[#D83C2D] hover:text-white flex items-center justify-center transition-colors shadow-2xs z-10 cursor-pointer disabled:opacity-50"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>

                                        {product?.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name || 'Товар'}
                                                width={68}
                                                height={68}
                                                className="object-contain max-h-full"
                                            />
                                        ) : (
                                            <ShoppingBag className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>

                                    {/* Информация о товаре */}
                                    <div className="flex-1 min-w-0 pr-1">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <div className="text-xs sm:text-sm font-bold text-gray-900">
                                                {Number(item.productItem.price).toFixed(2)} р.
                                            </div>

                                            {/* Кнопка с тремя точками для открытия доп. меню */}
                                            <button
                                                type="button"
                                                onClick={() => setActiveMenuCartItemId(item.id)}
                                                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                                title="Дополнительные действия"
                                                aria-label="Меню товара"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
                                            {product?.name}
                                        </h4>
                                        <p className="text-[11px] text-gray-400 mb-2 truncate">
                                            {isClothes ? 'Цвет' : 'Вкус'}: {item.productItem.taste || 'Стандартный'}, Размер: {item.productItem.size || 'Стандартный'}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            {/* Степпер количества */}
                                            <div className="flex items-center shadow rounded-[13px] px-2 py-1 bg-white ">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={isUpdating}
                                                    className="text-black transition-colors p-3 cursor-pointer disabled:opacity-50 swadow "
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-bold text-gray-900 px-1.5 min-w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={isUpdating}
                                                    className="text-black transition-colors p-3 cursor-pointer disabled:opacity-50 swadow "
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    )}
                </div>

                {/* Блок с итогами и кнопкой оформления */}
                {items.length > 0 && (
                    <div className="px-6 pt-4 pb-6 border-t border-gray-100 bg-white shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[20px] font-semibold text-black">Итого</span>
                            <span className="text-[20px] font-semibold text-black">
                                {(finalAmount + (selectedItems.length > 0 ? 15 : 0) + 15).toFixed(2)}  р.
                            </span>
                        </div>

                        <div className="space-y-1 text-sm text-black mb-4">
                            <div className="flex items-center justify-between">
                                <span>Количество товаров</span>
                                <span>{cartTotalItems}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Сумма за товары</span>
                                <span>{selectedTotalAmount.toFixed(2)} р.</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Скидка</span>
                                <span className={discount > 0 ? "text-[#D83C2D] font-semibold" : ""}>
                                    {discount > 0 ? `-${discount.toFixed(2)} р.` : "0 р."}
                                </span>
                            </div>

                            {/* Список примененных акций из бэкенда */}
                            {cart?.appliedPromotions && cart.appliedPromotions.length > 0 && (
                                <div className="py-1 space-y-0.5">
                                    {cart.appliedPromotions.map((promo) => (
                                        <div
                                            key={promo.promotionId}
                                            className="flex items-center justify-between text-xs text-[#D83C2D]/90 pl-2"
                                        >
                                            <span className="truncate max-w-50">
                                                • {promo.name}
                                            </span>
                                            <span>-{promo.amount.toFixed(2)} р.</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between font-medium text-gray-700 pt-0.5">
                                <span>Доставка</span>
                                <span>15 р.</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                router.push('/cart')
                                onOpenChange(false)
                            }}
                            disabled={selectedItems.length === 0}
                            className="w-full bg-[#D83C2D] hover:bg-[#c23325] text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
                        >
                            Оформить заказ
                        </button>
                    </div>
                )}

                {/* Всплывающее меню кнопки с тремя точками (как на 2-м экране дизайна) */}
                {activeCartItem && activeProduct && (
                    <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-fadeIn">
                        <div className="w-full max-w-70 bg-white rounded-3xl p-5 shadow-2xl relative space-y-2.5">
                            {/* Круглая кнопка закрытия справа вверху */}
                            <button
                                type="button"
                                onClick={() => setActiveMenuCartItemId(null)}
                                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-black transition-colors cursor-pointer"
                                aria-label="Закрыть меню"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* 1. Поделиться товаром (копирует ссылку) */}
                            <button
                                type="button"
                                onClick={() => {
                                    const shareUrl = `${window.location.origin}/catalog?product=${activeProduct.id}`
                                    navigator.clipboard.writeText(shareUrl)
                                    toast.success('Ссылка на товар скопирована!')
                                    setActiveMenuCartItemId(null)
                                }}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center cursor-pointer"
                            >
                                Поделиться товаром
                            </button>

                            {/* 2. Перенести в избранное (добавляет или убирает) */}
                            <button
                                type="button"
                                onClick={async () => {
                                    if (isItemFavorite) {
                                        await deleteFavorite(activeProduct.id)
                                    } else {
                                        await addToFavorite(activeProduct.id)
                                    }
                                    setActiveMenuCartItemId(null)
                                }}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center cursor-pointer"
                            >
                                {isItemFavorite ? 'Убрать из избранного' : 'Перенести в избранное'}
                            </button>

                            {/* 3. Добавить в сравнение (добавляет или убирает) */}
                            <button
                                type="button"
                                onClick={async () => {
                                    await toggleComparison(activeProduct.id)
                                    setActiveMenuCartItemId(null)
                                }}
                                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center cursor-pointer"
                            >
                                {isItemCompared ? 'Убрать из сравнения' : 'Добавить в сравнение'}
                            </button>

                            {/* 4. Удалить товар из корзины (красная кнопка внизу) */}
                            <button
                                type="button"
                                onClick={async () => {
                                    await removeFromCart(activeCartItem.id)
                                    setActiveMenuCartItemId(null)
                                }}
                                className="w-full bg-[#D83C2D] hover:bg-[#c23325] text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-xs text-center mt-1 cursor-pointer"
                            >
                                Удалить товар из корзины
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
