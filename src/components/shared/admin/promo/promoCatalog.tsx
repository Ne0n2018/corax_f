'use client'

import {useEffect} from "react";
import {usePromoStore} from "@/store/promo.store";

import {EditPromoDialog} from "./edit-promo-dialog";
import {PromoCard} from "@/components/shared/admin/promo/promoCard";

export function PromoCatalog() {
    const { isLoading, getAllPromos, promos } = usePromoStore();

    useEffect(() => {
        getAllPromos();
    }, [getAllPromos]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-50 w-full">
                <p className="text-sm text-gray-400 animate-pulse">Загрузка промокодов...</p>
            </div>
        );
    }

    if (!promos || promos.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-50 w-full text-gray-400 text-sm">
                Промокоды не найдены
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {promos.map((promo, index) => (
                    <PromoCard key={promo.id || index} promo={promo} index={index} />
                ))}
            </div>

            <EditPromoDialog />
        </>
    );
}