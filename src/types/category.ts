export interface SubCategory {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    SubCategory: SubCategory[]; // Обрати внимание: с большой буквы, как отдаёт Prisma/бэкенд
}

export interface CategoryCreate {
   name: string;
   subCategory: SubCategory[];
}