import { Product } from "@/types/favorite"
import { Heart, Loader2 } from "lucide-react";
import Image from "next/image";

interface FavoriteCartProps {
    product: Product
    isLoading: boolean;
    onDeleate: () => Promise<void>
    onAddToCart?: (productId: string) => void
}

export function FavoriteCart({ product,isLoading, onDeleate, onAddToCart }: FavoriteCartProps) {

    const handleDelete = async () => {
        await onDeleate()
    }


    return (
        <div className="relative bg-white rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
            {/* Кнопка сердечка (Удаление из избранного) */}
            <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                aria-label="Удалить из избранного"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-[9px] border border-black bg-white flex items-center justify-center text-[#D83C2D] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                    <Heart className="w-5 h-5 fill-[#D83C2D] text-[#D83C2D]" />
                )}
            </button>

            {/* Фото товара */}
            <div className="relative w-full h-44 my-2 flex items-center justify-center">
                {product.imageUrl ? (
                    <Image 
                        src={product.imageUrl} 
                        alt={product.name || 'Товар'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-2"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-xs">
                        Нет фото
                    </div>
                )}
            </div>

            {/* Контентная часть */}
            <div className="flex flex-col flex-1 justify-end pt-2">

                {/* Название товара */}
                <h4 className="text-xs sm:text-sm text-gray-500 leading-snug line-clamp-2 min-h-10 mb-3">
                    {product.name}
                </h4>

                {/* Кнопка добавления в корзину */}
                <button
                    type="button"
                    onClick={() => onAddToCart?.(product.id)}
                    className="w-full bg-[#D83C2D] hover:bg-[#c23325] active:scale-[0.98] text-white font-medium text-xs sm:text-sm py-3 rounded-2xl transition-all cursor-pointer text-center"
                >
                    В корзину
                </button>
            </div>
        </div>
    )
}