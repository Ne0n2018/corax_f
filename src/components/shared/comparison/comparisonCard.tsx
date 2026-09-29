'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Loader2, MoreHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComparisonItem, ComparisonProduct } from '@/types/comparison'
import { AddToCart } from '@/types/cart'
import { useCartStore } from '@/store/cart.store'

interface Props {
    item: ComparisonItem
    onRemove: (productId: string) => void
}

interface CharacteristicRow {
    label: string
    value: string
}

const getTastes = (product: ComparisonProduct) => product.Taste ?? product.taste ?? []
const getSizes = (product: ComparisonProduct) => product.Size ?? product.size ?? []

const optionNames = (options: { name: string }[]) =>
    options.map((option) => option.name).filter(Boolean).join(', ')

// isClothes === true означает, что «вкус» у товара — это цвет
const getTasteLabel = (product: ComparisonProduct) => (product.isClothes ? 'Цвет' : 'Вкус')

const formatPrice = (price: number) => `${Number(price || 0).toFixed(2)} р.`

const buildTitle = (product: ComparisonProduct) =>
    [
        product.name,
        product.Provider?.name ? `от ${product.Provider.name}` : '',
        product.formRelease ? `(${product.formRelease})` : '',
    ]
        .filter(Boolean)
        .join(' ')

// Список характеристик: сначала поля с сервера, затем вычисляемые из карточки товара
const buildRows = (product: ComparisonProduct): CharacteristicRow[] => {
    const rows: CharacteristicRow[] = (product.characteristic ?? [])
        .filter((characteristic) => characteristic?.name && characteristic?.value)
        .map((characteristic) => ({ label: characteristic.name, value: characteristic.value }))

    const addRow = (label: string, value?: string) => {
        const isDuplicate = rows.some((row) => row.label.toLowerCase() === label.toLowerCase())
        if (value && !isDuplicate) rows.push({ label, value })
    }

    addRow('Форма выпуска', product.formRelease)
    addRow('Производитель', product.Provider?.name)
    addRow(getTasteLabel(product), optionNames(getTastes(product)))
    addRow('Размер', optionNames(getSizes(product)))

    return rows
}

export function ComparisonCard({ item, onRemove }: Props) {
    const { product } = item
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
        useSortable({ id: item.productId })

    const { addToCart, isLoading: isCartLoading } = useCartStore()
    const [isAdding, setIsAdding] = useState(false)

    const rows = buildRows(product)
    const isAddingDisabled = isAdding || isCartLoading

    const handleAddToCart = async () => {
        const dto: AddToCart = {
            productId: product.id,
            price: Number(product.defaultPrice || 0),
            taste: getTastes(product)[0]?.name || 'Стандартный',
            size: getSizes(product)[0]?.name || 'Стандартный',
        }

        setIsAdding(true)
        try {
            await addToCart(dto)
        } catch {
            // Ошибка уже показана тостом в cart.store
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={cn('flex flex-col', isDragging && 'z-10 opacity-80')}
        >
            {/* Верхняя карточка товара */}
            <div className="relative bg-white rounded-3xl p-4 flex flex-col flex-1">
                <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    aria-label="Убрать из сравнения"
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-[9px] border border-gray-200 bg-white text-gray-400 hover:text-[#D83C2D] hover:border-[#D83C2D] active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex gap-3 pr-9">
                    <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name || 'Товар'}
                                fill
                                sizes="112px"
                                className="object-contain p-1.5"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                                Нет фото
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="text-lg sm:text-xl font-bold text-black font-russo">
                            {formatPrice(product.defaultPrice)}
                        </div>
                        <h3 className="mt-1 text-xs sm:text-sm text-gray-600 leading-snug line-clamp-3">
                            {buildTitle(product)}
                        </h3>
                        <div className="mt-2">
                            <div className="text-[11px] font-bold uppercase text-black">Форма выпуска</div>
                            <div className="text-xs text-gray-600 mt-0.5">{product.formRelease || '—'}</div>
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-[11px] sm:text-xs text-gray-400">Доставка в течении 3 дней</p>

                <div className="mt-4">
                    <h4 className="text-sm font-bold text-black">Состав</h4>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed min-h-16">
                        {product.structure || '—'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingDisabled}
                    className="mt-auto w-full bg-[#D83C2D] hover:bg-[#c23325] active:scale-[0.98] disabled:opacity-70 text-white font-medium text-xs sm:text-sm py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    {isAddingDisabled && <Loader2 className="w-4 h-4 animate-spin" />}
                    В корзину
                </button>
            </div>

            {/* Разделитель с ручкой перетаскивания */}
            <div className="relative flex items-center justify-center py-3">
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                <button
                    type="button"
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    aria-label="Перетащить товар"
                    title="Перетащите, чтобы поменять местами"
                    className={cn(
                        'relative z-10 px-4 py-1.5 rounded-full bg-[#3A3A40] border border-white/10 text-gray-400 hover:text-white transition-colors touch-none cursor-grab active:cursor-grabbing',
                        isDragging && 'text-white border-white/25',
                    )}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Характеристики */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-5 flex-1">
                <h4 className="text-sm sm:text-base font-bold text-white">Характеристики:</h4>
                {rows.length > 0 ? (
                    <ul className="mt-3 space-y-2.5">
                        {rows.map((row) => (
                            <li key={row.label} className="text-xs sm:text-sm leading-snug">
                                <span className="font-bold text-white">{row.label}:</span>{' '}
                                <span className="text-gray-300">{row.value}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-xs sm:text-sm text-gray-400">Характеристики не указаны</p>
                )}
            </div>
        </div>
    )
}
