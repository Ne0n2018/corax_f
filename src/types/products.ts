export interface AdminProduct {
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
    providerId: string;
    monthlySales: number;
    totalSales: number;
    createdAt: string;
    updatedAt: string;
}



export interface ProductsApiResponse {
    data: AdminProduct[];
    nextCursor: string | null;
}