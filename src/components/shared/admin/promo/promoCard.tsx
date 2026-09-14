'use client'

import {Pencil} from "lucide-react";
import {cn} from "@/lib/utils";
import {usePromoStore} from "@/store/promo.store";

interface PromoCardProps {
    promo: any;
    index: number;
}

export function PromoCard({ promo, index }: PromoCardProps) {
    const { setEditingPromo } = usePromoStore();
    const isActive = promo.isActive;

    return (
        <div className="flex items-center justify-between bg-[#242428] border border-[#50505E] rounded-[20px] p-2.5 gap-3">
            {/* Номер и код */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-[15px] bg-[#46464E] flex items-center justify-center text-white font-medium text-sm shrink-0">
                    {index + 1}
                </div>
                <span className="text-white font-semibold text-sm tracking-wide truncate">
                    {promo.code}
                </span>
            </div>

            {/* Статус и кнопка редактирования */}
            <div className="flex items-center gap-2.5 shrink-0">
                <p
                    className={cn(
                        "text-white text-xs font-medium px-3.5 py-2 rounded-[10px]",
                        isActive ? "bg-promo-active" : "bg-promo-unactive"
                    )}
                >
                    {isActive ? "Активен" : "Не активен"}
                </p>

                <button
                    type="button"
                    onClick={() => setEditingPromo(promo)}
                    className="w-10 h-10 rounded-[12px] bg-[#32333A] hover:bg-[#3D3E46] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}