'use client'

import {useEffect, useRef, useState} from 'react'
import Image from 'next/image'
import {ChevronRight, Heart, Minus, Plus} from 'lucide-react'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {useFavoriteStore} from '@/store/favorite.store'
import {useProductStore} from "@/store/product.store"

interface ProductDetailModalProps {
    productId: string
    isOpen: boolean
    onClose: () => void
    onSelectProduct?: (id: string) => void // Добавили коллбэк для родителя
}

export function ProductDetailModal({ productId, isOpen, onClose, onSelectProduct }: ProductDetailModalProps) {
    const [quantity, setQuantity] = useState(1)
    const [isExpanded, setIsExpanded] = useState(false)
    const modalContentRef = useRef<HTMLDivElement>(null)

    const { favoriteProductId, addToFavorite, deleteFavorite } = useFavoriteStore()
    const { getForCatalog, userProducts, getCurrentProduct, currentUserProduct } = useProductStore()

    const isFavorite = Array.isArray(favoriteProductId)
        ? favoriteProductId.includes(productId)
        : false

    // 1. Загружаем данные товара при смене productId
    useEffect(() => {
        if (productId) {
            getCurrentProduct(productId)
        }
    }, [productId, getCurrentProduct])

    // 2. Отправляем айди подкатегории товара в getForCatalog
    useEffect(() => {
        const subcategoryId = currentUserProduct.subCategoryId || currentUserProduct?.subCategoryId
        if (subcategoryId) {
            getForCatalog({subCategoryId: subcategoryId})
        }
    }, [currentUserProduct.subCategoryId, getForCatalog])

    // 3. Сбрасываем скролл, счетчик и состояние описания при смене текущего товара
    useEffect(() => {
        if (currentUserProduct?.id) {
            setQuantity(1)
            setIsExpanded(false)
            if (modalContentRef.current) {
                modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }
    }, [currentUserProduct?.id])

    const handleFavoriteToggle = () => {
        if (isFavorite) {
            deleteFavorite(productId)
        } else {
            addToFavorite(productId)
        }
    }

    // Обработчик клика по похожему товару
    const handleSelectSimilarProduct = (newProductId: string) => {
        getCurrentProduct(newProductId)
        if (onSelectProduct) {
            onSelectProduct(newProductId)
        }
    }

    // Фильтруем список, чтобы текущий товар не попал в "Похожие"
    const similarProducts = Array.isArray(userProducts)
        ? userProducts.filter((product) => product.id !== currentUserProduct?.id)
        : []

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                ref={modalContentRef}
                className="bg-white w-full sm:max-w-full md:max-w-full max-h-[90vh] overflow-y-auto custom-scrollbar overflow-x-hidden p-6 sm:p-8 rounded-[18px] font-sans"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{currentUserProduct?.name} от {currentUserProduct?.Provider?.name} ({currentUserProduct?.formRelease})</DialogTitle>
                    <DialogDescription>Детальная информация о товаре</DialogDescription>
                </DialogHeader>

                {/* Верхняя часть: Фото и основные данные */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mb-6 pt-2">
                    {/* Изображение */}
                    <div className="md:col-span-5 bg-gray-50/80 border border-gray-100 rounded-2xl p-6 flex items-center justify-center h-full min-h-70 relative overflow-hidden">
                        <Image
                            src={currentUserProduct?.imageUrl || '/placeholder-product.png'}
                            alt={currentUserProduct?.name || 'Товар'}
                            fill
                            className="object-contain p-4"
                        />
                    </div>

                    {/* Информация и кнопки действия */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2 pr-6">
                                <h2 className="text-xl font-bold text-black font-russo leading-snug">
                                    {currentUserProduct?.name} от {currentUserProduct?.Provider?.name} ({currentUserProduct?.formRelease})
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleFavoriteToggle}
                                    className={`p-2.5 rounded-2xl border transition-colors shrink-0 ${
                                        isFavorite
                                            ? 'border-[#D83C2D] text-[#D83C2D]'
                                            : 'border-gray-200 text-gray-400 hover:text-[#D83C2D] hover:border-[#D83C2D]'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#D83C2D]' : 'fill-none'}`} />
                                </button>
                            </div>

                            <div className="text-2xl font-semibold text-[#D83C2D] mb-4">
                                {currentUserProduct?.defaultPrice} p.
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-black uppercase mb-1">Краткое описание</h3>
                                <p className="text-sm text-black leading-relaxed">
                                    {currentUserProduct?.shortDescription}
                                </p>
                            </div>

                            <div className="mb-8.25">
                                <h3 className="text-xs font-bold text-black uppercase mb-1">Форма выпуска</h3>
                                <p className="text-xs sm:text-sm text-gray-700 font-medium">{currentUserProduct?.formRelease}</p>
                            </div>
                        </div>

                        {/* Панель управления количеством и покупки */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="flex items-center gap-5.5 shadow rounded-xl px-2 py-1.5">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                    className="p-3 hover:bg-gray-200 rounded-[13px] text-gray-600 transition-colors shadow"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-3 text-black font-semibold text-sm min-w-7 text-center">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                    className="p-3 hover:bg-gray-200 text-gray-600 transition-colors shadow"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                type="button"
                                className="flex-1 min-w-30 border border-[#D83C2D] text-[#D83C2D] hover:bg-[#D83C2D]/5 font-medium text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors text-center"
                            >
                                В корзину
                            </button>

                            <button
                                type="button"
                                className="flex-1 min-w-35 bg-[#D83C2D] hover:bg-[#c23325] text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors text-center"
                            >
                                Приобрести товар
                            </button>
                        </div>
                    </div>
                </div>

                {/* Подробное описание и Характеристики */}
                <div className="border-t border-gray-100 pt-5 mb-6">
                    <h3 className="text-xs font-bold text-black uppercase mb-2">Подробное описание</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                        {currentUserProduct?.description}
                    </p>
                    {isExpanded && (
                        <div className="space-y-4 pt-2 text-xs sm:text-sm text-gray-600 animate-fadeIn">
                            <div>
                                <h4 className="font-bold text-black mb-1">Состав</h4>
                                <p>{currentUserProduct?.structure}</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-black mb-2">Характеристики</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                                    <p><span className="text-gray-500">Форма выпуска:</span> {currentUserProduct?.formRelease}</p>
                                    <p><span className="text-gray-500">Производитель:</span> {currentUserProduct?.Provider?.name}</p>
                                    {currentUserProduct?.characteristic?.map((characteristic, index) => (
                                        <p key={index}>
                                            <span className="text-gray-500">{characteristic.name}:</span> {characteristic.value}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-black mb-1">Преимущества</h4>
                                <p>{currentUserProduct?.advantages}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs font-semibold text-gray-500 hover:text-black mt-2 underline transition-colors"
                    >
                        {isExpanded ? 'Свернуть описание' : 'Полное описание'}
                    </button>
                </div>

                {/* Похожие товары */}
                {similarProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-5">
                        <h3 className="text-xs font-bold text-black uppercase mb-4">Похожие товары</h3>

                        <div className="relative">
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                                {similarProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        className="min-w-35 sm:min-w-40 bg-white border border-gray-100 rounded-2xl p-3 flex flex-col justify-between shrink-0 snap-start hover:shadow-md transition-all text-left cursor-pointer group"
                                        onClick={() => handleSelectSimilarProduct(product.id)}
                                    >
                                        <div className="relative w-full h-24 mb-2 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                                            <Image
                                                src={product.imageUrl || '/placeholder-product.png'}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-2 group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="text-xs font-bold font-russo text-black mb-1">
                                            {product.defaultPrice} р.
                                        </div>
                                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                                            {product.name}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 border border-gray-200 rounded-full p-2 shadow-md hover:bg-white z-10 hidden sm:flex items-center justify-center"
                                aria-label="Прокрутить дальше"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-700" />
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}