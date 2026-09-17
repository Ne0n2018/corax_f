export interface AdminProduct {
    id: string;
    name: string;
    imageUrl: string;
    shortDescription: string;
    isClothes: boolean;
    Provider: {
        name: string;
    }
    description: string;
    advantages: string;
    structure: string;
    formRelease: string;
    defaultPrice: number;
    subCategoryId: string;
    providerId: string;
    monthlySales: number;
    totalSales: number;
    createdAt: string;
    updatedAt: string;
}

export type UserProduct = Omit<
    AdminProduct,
    | 'createdAt'
    | 'updatedAt'
    | 'monthlySales'
    | 'totalSales'
    | 'providerId'
    | 'subCategoryId'
>;
export interface ProductsApiResponse {
    data: AdminProduct[];
    nextCursor: string | null;
}

export interface UserCurrentProduct {
    id: string;
    name: string;
    imageUrl: string;
    shortDescription: string;
    description: string;
    isClothes: boolean;
    advantages: string;
    structure: string;
    formRelease: string;
    defaultPrice: number;
    subCategoryId: string;
    characteristic: [
        {
            name: string;
            value: string;
        }
    ]
    Taste: [
        {
            name: string;
            value: number;
        }
    ]
    Size :[
        {
            name: string;
            value: number;
        }
    ]
    Provider: {
        name: string;
    }
}