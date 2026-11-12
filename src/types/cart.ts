/**
 * Тело POST /cart. Поля price здесь нет: цену варианта считает сервер по прайсу
 * (default_price + наценка вкуса + наценка размера). Любая переданная клиентом
 * цена игнорируется, поэтому показывать в UI можно только сумму из GET /cart.
 */
export interface AddToCart {
    productId: string;
    taste: string;
    size: string;
}

export interface CartProduct {
    id: string;
    name: string;
    imageUrl: string;
    shortDescription: string;
    Provider?: {
        id: string;
        name: string;
    };
    isClothes: boolean;
    monthlySales?: number;
    totalSales?: number;
}

export interface CartProductItem {
    id: string;
    /** null если у позиции нет цены в текущем прайсе (товар снят / опция удалена) */
    price: number | null;
    taste: string;
    size: string;
    product: CartProduct;
}

export interface CartItem {
    id: string;
    quantity: number;
    productItem: CartProductItem;
}

export interface CartResponse {
    id: string;
    userId: string;
    totalAmount: number;
    discountAmount?: number;
    finalAmount?: number;
    appliedPromotions?: {
        promotionId: string;
        name: string;
        type: string;
        amount: number;
    }[];
    CartItem: CartItem[];
}