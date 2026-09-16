'use client'
import {usePromotionStore} from "@/store/promotion.store";
import {useEffect} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

export function FourSection() {
    const {isLoading, promotions, getActive} = usePromotionStore();

    useEffect(() => {
        getActive();
    }, [getActive]);

    return (
        <section className="relative w-full -mt-6 md:-mt-6 pt-5 pb-8 md:pt-6 md:pb-14 px-4 md:px-14 z-10 mb-5">

            {/* Мобильный SVG Фон (< md) — изгиб смещён влево под стык */}
            <svg
                viewBox="0 0 375 580"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-md md:hidden"
            >
                <path
                    d="
                       M 0,20
                       Q 0,0 20,0
                       L 155,0
                       C 185,0 200,50 230,50
                       L 355,50
                       Q 375,50 375,70
                       L 375,560
                       Q 375,580 355,580
                       L 20,580
                       Q 0,580 0,560
                       Z
                      "
                    fill="#2C2C31"
                />
            </svg>

            {/* Десктопный SVG Фон (>= md) — скорректирована траектория дуги */}
            <svg
                viewBox="0 0 1200 540"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-md hidden md:block"
            >
                <path
                    d="
                       M 0,20
                       Q 0,0 20,0
                       L 490,0
                       C 530,0 550,60 590,60
                       L 1180,60
                       Q 1200,60 1200,80
                       L 1200,520
                       Q 1200,540 1180,540
                       L 20,540
                       Q 0,540 0,520
                       Z
                      "
                    fill="#2C2C31"
                />
            </svg>

            {/* Заголовок секции */}
            <div className="flex flex-col items-start gap-1 mb-6 md:mb-10 z-10 pt-2 md:pt-2">
                <h2 className="text-[20px] md:text-3xl font-russo text-white leading-tight">
                    Акции и скидки
                </h2>
                <p className="font-mono text-xs md:text-sm text-[#BCBCBC] max-w-52.5 sm:max-w-none">
                    Выгодные предложения и специальные цены на популярные товары
                </p>
            </div>

            {/* Скелетоны при загрузке */}
            {isLoading && (
                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="w-[82vw] max-w-77.5 md:w-auto shrink-0 bg-white rounded-3xl overflow-hidden h-95 flex flex-col justify-between p-4">
                            <Skeleton className="w-full h-48 rounded-2xl bg-gray-200" />
                            <div className="space-y-3 mt-4">
                                <Skeleton className="h-6 w-3/4 bg-gray-200" />
                                <Skeleton className="h-4 w-full bg-gray-200" />
                            </div>
                            <Skeleton className="h-5 w-1/2 mt-4 bg-gray-200" />
                        </div>
                    ))}
                </div>
            )}

            {/* Список акций */}
            {!isLoading && promotions.length > 0 && (
                <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 w-full overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2 md:pb-0">
                    {promotions.map((promotion) => (
                        <div
                            key={promotion.id}
                            className="w-[82vw] max-w-77.5 md:w-auto shrink-0 snap-center bg-white rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative w-full h-48 md:h-52 bg-[#E2E2E2]">
                                {promotion.imageUrl ? (
                                    <Image
                                        src={promotion.imageUrl}
                                        alt={promotion.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#E2E2E2]" />
                                )}

                                {'badgeText' in promotion && (promotion as { badgeText?: string }).badgeText && (
                                    <span className="absolute top-3 left-3 bg-[#D83C2D] text-white font-mono text-[11px] md:text-xs px-3 py-1.5 rounded-lg font-medium">
                                        {(promotion as { badgeText?: string }).badgeText}
                                    </span>
                                )}
                            </div>

                            <div className="p-5 md:p-6 flex flex-col flex-1 justify-between gap-4 text-black">
                                <div>
                                    <h3 className="text-lg md:text-xl font-russo leading-snug mb-2">
                                        {promotion.name}
                                    </h3>
                                    <p className="font-mono text-xs md:text-sm text-[#737373] leading-relaxed line-clamp-2">
                                        {promotion.description}
                                    </p>
                                </div>

                                <Link
                                    href="/catalog"
                                    className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-black hover:text-[#D83C2D] transition-colors mt-auto"
                                >
                                    Приступить к покупкам <span className="text-base">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}