// Максимальное количество товаров в сравнении (ограничение бэкенда)
export const MAX_COMPARISON_ITEMS = 2;

export interface ComparisonProductOption {
    id: string;
    name: string;
    price: number;
}

export interface ComparisonCharacteristic {
    name: string;
    value: string;
}

export interface ComparisonProduct {
    id: string;
    name: string;
    imageUrl: string;
    shortDescription: string;
    isClothes: boolean;
    description: string;
    advantages: string;
    structure: string;
    formRelease: string;
    defaultPrice: number;
    subCategoryId: string;
    Taste?: ComparisonProductOption[] | null;
    Size?: ComparisonProductOption[] | null;
    taste?: ComparisonProductOption[] | null;
    size?: ComparisonProductOption[] | null;
    characteristic?: ComparisonCharacteristic[] | null;
    Provider?: {
        id?: string;
        name: string;
    } | null;
}

// Ответ GET /comparison
export interface ComparisonItem {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
    product: ComparisonProduct;
}

// Ответ GET /comparison/check/{productId}
export interface ComparisonCheckResponse {
    isInComparison?: boolean;
    isCompared?: boolean;
    result?: boolean;
    productId?: string;
}
