export interface AddToCart {
    productId: string;
    price: number;
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
    price: number;
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