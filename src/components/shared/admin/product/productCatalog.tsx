'use client'

import {useProductStore} from "@/store/product.store";
import {useCallback, useEffect, useRef, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import Image from "next/image";

export function ProductCatalog() {
    const { products, adminGet, isLoading, isFetchingMore, error, nextCursor } = useProductStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const observer = useRef<IntersectionObserver | null>(null);

    // Задержка в 500мс, чтобы не дергать API на каждую букву
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Делаем запрос каждый раз, когда меняется отложенное значение поиска
    useEffect(() => {
        adminGet(debouncedSearch, false);
    }, [debouncedSearch]);

   useEffect(()=>{
       adminGet(debouncedSearch, false);
   }, [debouncedSearch]);

   const lastElementRef = useCallback((node: HTMLDivElement)=>{
       if (isLoading || isFetchingMore) return ;
       if (observer.current) observer.current.disconnect();

       observer.current = new IntersectionObserver((entries) => {
           if (entries[0].isIntersecting && nextCursor) {
               adminGet(debouncedSearch, true);
           }
       })
       if (node) observer.current.observe(node);
   },[isLoading, isFetchingMore, nextCursor, debouncedSearch, adminGet])

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="w-full">
                <Input
                    type="text"
                    placeholder="Введите название товара..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#2C2C31] border-[#50505E] text-white placeholder:text-gray-400 rounded-[20px] px-7.5 py-5.75 focus-visible:ring-1 focus-visible:ring-red-500"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Показываем лоадер только при первичном поиске, чтобы не скрывать уже загруженные товары при подгрузке */}
            {isLoading ? (
                <p className="text-white text-sm">Загрузка каталога...</p>
            ) : (
                <>
                    {products.length === 0 ? (
                        <p className="text-white text-sm">Товары не найдены</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-3xl px-8.25 py-1.75 flex flex-col justify-between min-h-85"
                                >
                                    <div className="relative w-full mb-3 flex items-center justify-center">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain"
                                                width={218}
                                                height={166}
                                            />
                                    </div>

                                    <div className="flex flex-col gap-1 mb-1.5 flex-1">
                                        <p className="text-black font-bold text-lg leading-none">
                                             {product.name}
                                        </p>
                                        <p className="text-[#737373] text-sm leading-tight line-clamp-2">
                                            {product.shortDescription}
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full bg-[#D83C2D] hover:bg-[#b83325] text-white rounded-[14px] py-3 text-sm font-medium transition-colors"
                                    >
                                        <Link href={`/admin/product/${product.id}`}>
                                            Редактировать
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {nextCursor && (
                        <div
                            ref={lastElementRef}
                            className="flex justify-center items-center py-6"
                        >
                            {isFetchingMore && (
                                <p className="text-gray-400 text-sm">Загружаем еще товары...</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}