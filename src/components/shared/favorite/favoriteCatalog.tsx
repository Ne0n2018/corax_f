'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { useFavoriteStore } from "@/store/favorite.store"
import { useEffect } from "react"
import { FavoriteCart } from "./favoriteCart"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

export function FavoriteCatalog() {
    const { 
        isLoading, 
        getUserFavorute, 
        userFavorite, 
        deleteFavorite 
    } = useFavoriteStore()
    const router = useRouter()

    useEffect(() => {
        getUserFavorute()
    }, [getUserFavorute])

    // Безопасно достаем массив товаров. Если userFavorite === null, будет пустой массив []
    const products = userFavorite?.product ?? []

    return (
        <div className="p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-125">
            {/* 1. Состояние загрузки */}
            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48 bg-white/10" />
                    <Skeleton className="h-32 w-full bg-white/10 rounded-xl" />
                </div>
            )}

            {/* 2. Блок "Пусто", если загрузка завершена и товаров нет */}
            {!isLoading && products.length === 0 && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">
                            Избранное
                        </h2>
                        <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                            Список понравившихся вам товаров
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                        <div className="p-4 bg-white/5 rounded-full text-gray-400">
                            <Heart className="w-12 h-12" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-bold text-white">
                                В избранном пока пусто
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                                Нажимайте на иконку сердечка в каталоге, чтобы сохранить интересные товары
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
                </div>
            )}

            {/* 3. Отрисовка карточек товаров */}
            {!isLoading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((item) => (
                        <FavoriteCart 
                            key={item.id} 
                            product={item} 
                            onDeleate={() => deleteFavorite(item.id)}
                            onAddToCart={()=> router.push(`/catalog/${item.id}`)}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}