'use client'

import React from 'react'
import Image from 'next/image'
import { CartItem } from '@/types/cart'
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react'

interface CheckoutItemsProps {
    items: CartItem[]
    selectedItemIds: string[]
    onToggleSelect: (id: string) => void
    onUpdateQuantity: (id: string, quantity: number) => void
    isUpdating?: boolean
}

export function CheckoutItems({
    items,
    selectedItemIds,
    onToggleSelect,
    onUpdateQuantity,
    isUpdating = false,
}: CheckoutItemsProps) {
    // Вычисляем примерные даты доставки (например, через 1-2 дня)
    const getDeliveryDateRange = () => {
        const today = new Date()
        const start = new Date(today)
        start.setDate(today.getDate() + 1)
        const end = new Date(today)
        end.setDate(today.getDate() + 2)

        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ]

        if (start.getMonth() === end.getMonth()) {
            return `${start.getDate()} - ${end.getDate()} ${months[start.getMonth()]}`
        }
        return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`
    }

    return (
        <div className="space-y-4">
            {/* Заголовок секции с примерной датой доставки */}
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    Выбранные товары
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Будет доставлено {getDeliveryDateRange()}
                </p>
            </div>

            {/* Карточки товаров */}
            <div className="space-y-3">
                {items.map((item) => {
                    const product = item.productItem.product
                    const isSelected = selectedItemIds.includes(item.id)
                    const isClothes = product?.isClothes

                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all flex items-center gap-3 sm:gap-4"
                        >
                            {/* Чекбокс выбора товара */}
                            <button
                                type="button"
                                onClick={() => onToggleSelect(item.id)}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                    isSelected
                                        ? 'border-[#D83C2D] bg-[#D83C2D] text-white'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                                aria-label="Выбрать товар"
                            >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>

                            {/* Фотография товара */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                                {product?.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name || 'Товар'}
                                        width={70}
                                        height={70}
                                        className="object-contain max-h-full"
                                    />
                                ) : (
                                    <ShoppingBag className="w-7 h-7 text-gray-300" />
                                )}
                            </div>

                            {/* Информация о товаре */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm sm:text-base font-bold text-gray-900 mb-0.5">
                                    {Number(item.productItem.price).toFixed(2)} р.
                                </div>
                                <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1">
                                    {product?.name}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-gray-400 mb-2 truncate">
                                    {isClothes ? 'Цвет' : 'Вкус'}: {item.productItem.taste || 'Стандартный'}, Размер: {item.productItem.size || 'Стандартный'}
                                </p>

                                {/* Степпер количества */}
                                <div className="inline-flex items-center border border-gray-200 rounded-xl px-2 py-1 bg-white shadow-2xs">
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={isUpdating}
                                        className="text-gray-400 hover:text-black transition-colors px-1 cursor-pointer disabled:opacity-50"
                                        aria-label="Уменьшить количество"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-xs sm:text-sm font-bold text-gray-900 px-2 min-w-5 text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        disabled={isUpdating}
                                        className="text-gray-400 hover:text-black transition-colors px-1 cursor-pointer disabled:opacity-50"
                                        aria-label="Увеличить количество"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
