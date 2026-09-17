'use client'
import {useProductStore} from "@/store/product.store";
import {useEffect, useRef} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";
import {Heart} from "lucide-react";
import {useFavoriteStore} from "@/store/favorite.store";
import Link from "next/link";

interface CatalogProps {
    currentSearch?: string;
    currentSubCategoryId?: string;
}

export function Catalog({ currentSearch = '', currentSubCategoryId }: CatalogProps) {
    const { isLoading, getForCatalog, userProducts, userNextCursor, isFetchingMore } = useProductStore();
    const { isLoading: favoriteLoading, addToFavorite, getFavorite, deleteFavorite, favoriteProductId } = useFavoriteStore();
    const observerTarget = useRef<HTMLDivElement | null>(null);

    // 1. Передаем параметры поиска при монтировании и изменении фильтров
    useEffect(() => {
        getForCatalog({ name: currentSearch, subCategoryId: currentSubCategoryId });
        getFavorite();
    }, [getForCatalog, getFavorite, currentSearch, currentSubCategoryId]);

    // 2. Настройка бесконечной загрузки
    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && userNextCursor && !isFetchingMore && !isLoading) {
                    getForCatalog({
                        name: currentSearch,
                        subCategoryId: currentSubCategoryId,
                        loadMore: true,
                    });
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [userNextCursor, isFetchingMore, isLoading, currentSearch, currentSubCategoryId, getForCatalog]);

    const handleFavoriteToggle = (productId: string, isFavorite: boolean) => {
        if (isFavorite) {
            deleteFavorite(productId);
        } else {
            addToFavorite(productId);
        }
    };

    return (
        <section className="relative px-4 py-6 -mt-19">
            {/* Подложка: SVG-шапка фиксированной высоты + белый блок для тела */}
            <div className="absolute inset-0 -z-10 flex flex-col pointer-events-none">
                <div className="w-full h-19 sm:h-22 shrink-0">
                    <svg
                        viewBox="0 0 1200 92"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 20C0 8.95431 8.95431 0 20 0H216.137C224.226 0 231.518 4.87268 234.614 12.3457L254.364 60.0205C257.463 67.5001 264.765 72.3731 272.861 72.3652L1179.98 71.4707C1191.03 71.4599 1200 80.4175 1200 91.4707V92H0V20Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <div className="w-full flex-1 bg-white rounded-b-[20px] -mt-px" />
            </div>

            {/* Заголовок внутри язычка */}
            <div className="h-15 sm:h-17 flex items-center px-4 sm:px-6">
                <h1 className="text-xl sm:text-2xl font-bold text-black font-russo">
                    Все товары
                </h1>
            </div>

            {/* Контент каталога */}
            <div className="pt-2">
                {/* Первичный скелетон */}
                {isLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-gray-100 p-3 md:p-4 flex flex-col justify-between h-85 md:h-95"
                            >
                                <Skeleton className="w-full h-36 md:h-48 rounded-xl bg-gray-200" />
                                <div className="space-y-2 my-3">
                                    <Skeleton className="h-5 w-1/2 bg-gray-200" />
                                    <Skeleton className="h-4 w-full bg-gray-200" />
                                    <Skeleton className="h-4 w-3/4 bg-gray-200" />
                                </div>
                                <Skeleton className="h-9 w-full rounded-xl bg-gray-200" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Сетка товаров */}
                {!isLoading && userProducts.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {userProducts.map((product) => {
                                const isFavorite = Array.isArray(favoriteProductId)
                                    ? favoriteProductId.includes(product.id)
                                    : false;

                                return (
                                    <Link href={`/catalog/${product.id}`} key={product.id} className={"bg-white rounded-2xl border border-gray-100 p-3 md:p-4 flex flex-col justify-between hover:shadow-md transition-shadow group relative bloc"} scroll={false}>
                                        <div
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleFavoriteToggle(product.id, isFavorite)}
                                                disabled={favoriteLoading}
                                                className={`absolute top-3 right-3 z-10 p-2.5 rounded-[13px] bg-white border transition-colors flex items-center justify-center ${
                                                    isFavorite
                                                        ? "border-[#D83C2D] text-[#D83C2D]"
                                                        : "border-[#000000]/55 text-[#000000]/55 hover:text-[#D83C2D] hover:border-[#D83C2D]"
                                                }`}
                                                aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                                            >
                                                <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-[#D83C2D]" : "fill-none"}`} />
                                            </button>

                                            <div className="relative w-full h-36 sm:h-44 md:h-48 mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50/50">
                                                {product.imageUrl ? (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                        Нет фото
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col flex-1 justify-start">
                                                <div className="text-sm sm:text-base md:text-lg font-bold text-black font-russo mb-1">
                                                    от {product.defaultPrice} BYN
                                                </div>
                                                <h3 className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-tight mb-3 font-sans">
                                                    {product.name} {product.Provider?.name ? `от ${product.Provider.name}` : ''} ({product.formRelease})
                                                </h3>
                                            </div>

                                            <button
                                                type="button"
                                                className="w-full bg-[#D83C2D] hover:bg-[#c23325] text-white text-xs sm:text-sm font-medium py-2 md:py-2.5 rounded-xl transition-colors mt-auto font-sans"
                                            >
                                                В корзину
                                            </button>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Скелетон дозагрузки */}
                        {isFetchingMore && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="bg-white rounded-2xl border border-gray-100 p-3 md:p-4 flex flex-col justify-between h-85 md:h-95">
                                        <Skeleton className="w-full h-36 md:h-48 rounded-xl bg-gray-200" />
                                        <div className="space-y-2 my-3">
                                            <Skeleton className="h-5 w-1/2 bg-gray-200" />
                                            <Skeleton className="h-4 w-full bg-gray-200" />
                                        </div>
                                        <Skeleton className="h-9 w-full rounded-xl bg-gray-200" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div ref={observerTarget} className="h-10 w-full my-2" />
                    </>
                )}

                {/* Состояние пустого списка */}
                {!isLoading && userProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500 font-sans">
                        Товары не найдены
                    </div>
                )}
            </div>
        </section>
    );
}