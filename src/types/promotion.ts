export enum PromotionType {
    FIRST_ORDER = "FIRST_ORDER",
    BUY_X_GET_Y = "BUY_X_GET_Y",
    POPULAR="POPULAR",
}

export enum DiscountMethodType {
    PERCENT = "PERCENT",
    FIXED = "FIXED",
}

export interface GetPromotionsParams {
    limit?: number;
    page?: number;
    active?: boolean;
    type?: PromotionType;
    name?: string;
}

export interface Promotion {
    id: string;
    name: string;
    description: string;
    type: PromotionType
    discountMethod: DiscountMethodType
    discountValue: number;
    buyQuantity: number | null;
    getQuantity: number | null;
    popularTopN: number | null;
    active: boolean;
    expiresAt: string | null;
    imageUrl: string;
}

export interface PromotionCreate extends Omit<Promotion, 'id' | 'imageUrl'> {
    image: File | null;
}