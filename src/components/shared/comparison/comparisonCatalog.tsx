'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Scale, ShoppingBag, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useComparisonStore } from '@/store/comparison.store'
import { ComparisonCard } from './comparisonCard'

export function ComparisonCatalog() {
    const {
        isLoading,
        comparisonItems,
        getComparison,
        removeFromComparison,
        clearComparison,
        reorderComparison,
    } = useComparisonStore()

    useEffect(() => {
        getComparison()
    }, [getComparison])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            reorderComparison(String(active.id), String(over.id))
        }
    }

    const items = comparisonItems.filter((item) => item?.product)
    const ids = items.map((item) => item.productId)

    return (
        <div className="p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-125">
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">Сравнение товара</h2>
                    <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                        Сравнение характеристик выбранных товаров
                    </p>
                </div>

                {items.length > 0 && (
                    <button
                        type="button"
                        onClick={clearComparison}
                        className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs sm:text-sm text-gray-300 hover:text-white hover:border-white/25 transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                        Очистить
                    </button>
                )}
            </div>

            {/* Загрузка */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="space-y-3">
                            <Skeleton className="h-64 w-full rounded-3xl bg-white/10" />
                            <Skeleton className="h-24 w-full rounded-3xl bg-white/10" />
                        </div>
                    ))}
                </div>
            )}

            {/* Пустое состояние */}
            {!isLoading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-gray-400">
                        <Scale className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white">Нет товаров для сравнения</h3>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                            Добавляйте товары к сравнению в каталоге, чтобы сопоставить их характеристики
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

            {/* Колонки сравнения: перетаскивание меняет товары местами */}
            {!isLoading && items.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={ids} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
                            {items.map((item) => (
                                <ComparisonCard
                                    key={item.productId}
                                    item={item}
                                    onRemove={removeFromComparison}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}
