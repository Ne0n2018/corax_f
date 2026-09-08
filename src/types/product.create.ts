export interface ProductVariation {
    name: string;
    price: number;
}

export interface ProductCharacteristic {
    name: string;
    value: string;
}

export interface CreateProductDto {
    name: string;
    shortDescription: string;
    description: string;
    isClothes: boolean;
    advantages: string;
    structure: string;
    formRelease: string;
    defaultPrice: number;
    subCategoryId: string;
    providerId: string;
    image: File  // Файл изображения
    size: ProductVariation[]; // Массив размеров
    taste: ProductVariation[]; // Массив вкусов
    characteristic: ProductCharacteristic[]; // Массив характеристик
}