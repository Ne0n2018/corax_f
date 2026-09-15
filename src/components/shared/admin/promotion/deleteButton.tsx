'use client'
import {usePromotionStore} from "@/store/promotion.store";

interface DeleteButtonProps {
    promotionId: string;
    callBack: () => void;
}

export function DeleteButton ({promotionId, callBack}: DeleteButtonProps) {
    const {isLoading, deletePromotion} = usePromotionStore()
    const onClick = (id: string) => {
        deletePromotion(id)
        callBack()
    }
    return (
        <button
            type="button"
            onClick={()=> onClick(promotionId)}
            disabled={isLoading }
            className="flex items-center justify-center bg-[#46464E] hover:bg-red-500/10  border border-transparent hover:border-red-500/30 py-2.75 px-2.5 rounded-[12px] transition-colors cursor-pointer disabled:opacity-50"
            title="Удалить акцию"
        >
            {isLoading ? <span className="animate-pulse px-2">...</span> : "Удалить"}
        </button>
    )
}