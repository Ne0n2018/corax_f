export interface SubCategory {
    id: string | undefined;
    name: string | undefined;
}

interface subCategoryWithOutId {
    name: string | undefined;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    SubCategory: SubCategory[]; // Обрати внимание: с большой буквы, как отдаёт Prisma/бэкенд
}

// Ответ публичного GET /category: только id/name без служебных полей
export interface PublicCategory {
    id: string;
    name: string;
    SubCategory: SubCategory[];
}

export interface CategoryCreate {
   name: string;
   subCategory?: subCategoryWithOutId[];
}