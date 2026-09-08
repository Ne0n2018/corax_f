import {create} from "zustand";
import {api} from "@/lib/api";
import {AdminProduct, CreateProductDto, ProductsApiResponse,} from "@/types/products";
import {toast} from "sonner";

interface ProductStoreProps {
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    products: AdminProduct[];
    currentProduct: AdminProduct | null;
    nextCursor: string | null;

    adminGet: (name?: string, loadMore?: boolean) => Promise<void>;
    adminCreate: (data: CreateProductDto) => Promise<boolean>;
    adminGetById: (id: string) => Promise<void>;
    adminUpdate: (id: string, data: CreateProductDto) => Promise<boolean>;
    adminDelete: (id: string) => Promise<boolean>;
}

export const useProductStore = create<ProductStoreProps>((set, get) => ({
    isLoading: false,
    isFetchingMore: false,
    error: null,
    products: [],
    nextCursor: null,
    currentProduct: null,

    adminGet: async (name = "", loadMore = false) => {
        const { nextCursor, products } = get();

        if (loadMore) {
            set({ isFetchingMore: true, error: null });
        } else {
            set({ isLoading: true, error: null });
        }

        try {
            const params = new URLSearchParams();

            // Бэкенд фильтрует по dto.name
            if (name) params.append("name", name);
            if (loadMore && nextCursor) params.append("cursor", nextCursor);

            const response = await api.get<ProductsApiResponse>(`/admin/product?${params.toString()}`);

            const newProducts = response.data.data || [];

            set({
                isLoading: false,
                isFetchingMore: false,
                products: loadMore ? [...products, ...newProducts] : newProducts,
                nextCursor: response.data.nextCursor,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                isFetchingMore: false,
                products: loadMore ? products : [],
                error: error.response?.data?.message || "Ошибка при загрузке товаров",
            });
        }
    },

    adminCreate: async (data: CreateProductDto) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();

            formData.append('image', data.image)
            formData.append("name", data.name);
            formData.append("defaultPrice", String(data.defaultPrice));
            formData.append("isClothes", String(data.isClothes));
            formData.append("subCategoryId", data.subCategoryId);
            formData.append("providerId", data.providerId);
            formData.append("shortDescription", data.shortDescription);
            formData.append("description", data.description);
            formData.append("advantages", data.advantages);
            formData.append("structure", data.structure);
            formData.append("formRelease", data.formRelease);

            // 3. Массивы объектов отправляем строкой JSON
            formData.append("size", JSON.stringify(data.size));
            formData.append("taste", JSON.stringify(data.taste));
            formData.append("characteristic", JSON.stringify(data.characteristic));

            // 4. Отправляем НАПРЯМУЮ экземпляр formData
            await api.post("/admin/product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            set({ isLoading: false });
            toast.success('Товар успешно создан')
            return true;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Ошибка при создании товара",
            });
            toast.error(error.response?.data?.message)
            return false;
        }

    },

    adminGetById: async (id: string) =>{
        set({isLoading: true, error: null})
        try {
            const response = await api.get(`/admin/product/${id}`)
            set({isLoading: false, error: null, currentProduct: response.data})
        } catch (error: any) {
            set({isLoading: false, error: error.response?.message})
            toast.error(error.response?.message)
        }
    },

    adminUpdate: async (id: string, data: CreateProductDto) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();

            // Добавляем файл только если загружен НОВЫЙ File (не строка URL)
            if (data.image instanceof File) {
                formData.append("image", data.image, data.image.name);
            }

            formData.append("name", data.name);
            formData.append("defaultPrice", String(data.defaultPrice));
            formData.append("isClothes", String(data.isClothes));
            formData.append("subCategoryId", data.subCategoryId);
            formData.append("providerId", data.providerId);
            formData.append("shortDescription", data.shortDescription);
            formData.append("description", data.description);
            formData.append("advantages", data.advantages);
            formData.append("structure", data.structure);
            formData.append("formRelease", data.formRelease);

            formData.append("size", JSON.stringify(data.size));
            formData.append("taste", JSON.stringify(data.taste));
            formData.append("characteristic", JSON.stringify(data.characteristic));

            // Отправляем PATCH или PUT запрос
            await api.put(`/admin/product${id}`, formData);

            set({ isLoading: false });
            return true;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Ошибка при обновлении товара",
            });
            return false;
        }
    },

    adminDelete: async (id: string) => {
        set({isLoading: true, error: null})

        try {
            const response = await api.delete(`/admin/product${id}`)
            set({isLoading: false, error: null})
            toast.success(response.data.message)
            return true;
        } catch (error: any) {
            set({isLoading: false, error: error.response?.data.message})
            toast.error(error.response?.data?.message)
            return false;
        }
    }
}));

