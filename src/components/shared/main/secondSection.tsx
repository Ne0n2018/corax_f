'use client'

import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {useTopProductStore} from "@/store/top_product.store";
import {useEffect} from "react";
import {TopProduct} from "@/types/topProduct";
import Link from "next/link";
import Image from "next/image";
import {SectionTab} from "@/components/shared/main/sectionTab";
import { cn } from "@/lib/utils";

interface SecondSectionProps {
    className?: string;
}

export function SecondSection({className}:SecondSectionProps) {
    const { isLoading, topProducts, getTopProducts } = useTopProductStore();

    useEffect(() => {
        getTopProducts();
    }, [getTopProducts]);

    return (
        // Внешний блок: margin-top подобран так, чтобы зазор между телами 1→2
        // оставался 128px: на десктопе -72px (выступ 100px), на мобилке -2px (выступ 65px)
        <div className={cn("relative w-full -mt-0.5 md:-mt-18 pt-12 md:pt-20", className)}>

            {/* Body-блок секции: сплошной фон, скругления и контент */}
            <div
                className="relative w-full pt-6 pb-6 md:pt-10 md:pb-10 px-4 md:px-14 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 md:gap-8 bg-[#2C2C31] rounded-[20px] md:rounded-[22px] shadow-sm"
                style={{borderTopLeftRadius: 0}}
            >

                {/* Текстовый блок и кнопка */}
                <div className="w-full lg:max-w-xs flex flex-col items-start gap-2.5 md:gap-3.5 z-10 pt-2 md:pt-6">
                    {/* Сокращенный текст для мобильных (< md) */}
                    <p className="md:hidden font-mono text-sm text-[#BCBCBC] leading-relaxed">
                        Лидеры продаж сезона
                    </p>

                    {/* Полный текст для десктопа (>= md) */}
                    <p className="hidden md:block font-mono text-base text-[#BCBCBC] leading-relaxed">
                        Самые популярные и востребованные товары этого сезона, проверенные временем и нашей аудиторией
                    </p>

                    <Button className="w-full md:w-auto mt-2 text-black bg-white hover:bg-gray-100 rounded-2xl md:rounded-[13px] px-8 py-3.5 font-medium transition-colors cursor-pointer text-sm md:text-base">
                        Узнать больше
                    </Button>
                </div>

                {/* Сетка товаров и Скелетоны */}
                <div className="grid grid-cols-2 md:flex md:flex-nowrap gap-3 md:gap-4 w-full lg:w-auto z-10 pt-2 md:pt-6 lg:pt-12">
                    {isLoading && Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className={`w-full aspect-square md:w-64.25 md:h-63.5 shrink-0 rounded-[20px] bg-[#3A3A3F] ${
                                index === 2 ? "hidden md:block" : ""
                            }`}
                        />
                    ))}

                    {!isLoading && topProducts.length > 0 && topProducts.slice(0, 3).map((topProduct: TopProduct, index: number) => (
                        <div
                            key={topProduct.id}
                            className={`relative w-full aspect-square md:w-64.25 md:h-63.5 shrink-0 rounded-[20px] overflow-hidden bg-[#E2E2E2] ${
                                index === 2 ? "hidden md:block" : ""
                            }`}
                        >
                            <Link href={`/catalog/${topProduct.id}`} className="group block w-full h-full relative">
                                <Image
                                    src={topProduct.imageUrl}
                                    alt={topProduct.name}
                                    fill
                                    className="object-contain p-3 md:p-4 transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/20 to-black/90 pointer-events-none z-10" />
                                <p className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20 font-russo text-white text-xs md:text-base leading-snug line-clamp-2">
                                    {topProduct.name}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Выступ сверху слева: стыкуется с первой секцией */}
            <SectionTab side="top-left" fill="#2C2C31">
                <h2 className="text-2xl md:text-4xl font-russo text-white leading-tight">Топ сезона</h2>
            </SectionTab>
        </div>
    );
}