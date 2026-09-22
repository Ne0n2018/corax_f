import {create} from "zustand";
import {api} from "@/lib/api";
import {AdminProduct, ProductsApiResponse, UserCurrentProduct, UserProduct} from "@/types/products";
import {toast} from "sonner";

interface GetForCatalogParams {
    name?: string;
    subCategoryId?: string;
    loadMore?: boolean;
}

interface ProductStoreProps {
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    products: AdminProduct[];
    currentProduct: AdminProduct | null;
    currentUserProduct: UserCurrentProduct | null;
    nextCursor: string | null;

    // Новые поля для пользовательского каталога
    userProducts: UserProduct[];
    userNextCursor: string | null;

    // Похожие товары для модального окна
    similarProducts: UserProduct[];
    isSimilarLoading: boolean;

    adminGet: (name?: string, loadMore?: boolean) => Promise<void>;
    adminCreate: (data: any) => Promise<boolean>;
    adminGetById: (id: string) => Promise<void>;
    adminUpdate: (id: string, data: any) => Promise<boolean>;
    adminDelete: (id: string) => Promise<boolean>;

    // Обновлённый метод получения товаров каталога
    getForCatalog: (params?: GetForCatalogParams) => Promise<void>;
    getCurrentProduct: (id: string) => Promise<void>;
    getSimilarProducts: (subCategoryId: string) => Promise<void>;
    clearSimilarProducts: () => void;
}

export const useProductStore = create<ProductStoreProps>((set, get) => ({
    isLoading: false,
    isFetchingMore: false,
    error: null,
    products: [],
    userProducts: [],
    similarProducts: [],
    isSimilarLoading: false,
    nextCursor: null,
    userNextCursor: null,
    currentProduct: null,
    currentUserProduct: null,

    adminGet: async (name = "", loadMore = false) => {
        const { nextCursor, products } = get();

        if (loadMore) {
            set({ isFetchingMore: true, error: null });
        } else {
            set({ isLoading: true, error: null });
        }

        try {
            const params = new URLSearchParams();

            if (name) params.append("name", name);
            if (loadMore && nextCursor) params.append("cursor", nextCursor);

            const response = await api.get<ProductsApiResponse>(`/admin/product?${params.toString()}`);
            const newProducts = response.data.data || [];

            set({
                isLoading: false,
                isFetchingMore: false,
                products: loadMore ? [...products, ...newProducts] : newProducts,
                nextCursor: response.data.nextCursor || null,
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

    adminCreate: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();

            formData.append("image", data.image);
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

            await api.post("/admin/product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            set({ isLoading: false });
            toast.success("Товар успешно создан");
            return true;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Ошибка при создании товара",
            });
            toast.error(error.response?.data?.message);
            return false;
        }
    },

    adminGetById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/admin/product/${id}`);
            set({ isLoading: false, error: null, currentProduct: response.data });
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data?.message });
            toast.error(error.response?.data?.message);
        }
    },

    adminUpdate: async (id: string, data: any) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();

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

            await api.put(`/admin/product/${id}`, formData);

            set({ isLoading: false });
            toast.success("Товар успешно обновлен");
            return true;
        } catch (error: any) {
            const rawMsg = error.response?.data?.message;
            let message = "Ошибка при обновлении товара";
            if (Array.isArray(rawMsg)) {
                message = rawMsg
                    .map((e: any) => (typeof e === "string" ? e : Object.values(e.constraints || {}).join(", ")))
                    .filter(Boolean)
                    .join("; ");
            } else if (typeof rawMsg === "string") {
                message = rawMsg;
            }
            set({
                isLoading: false,
                error: message,
            });
            toast.error(message);
            return false;
        }
    },

    adminDelete: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.delete(`/admin/product/${id}`);
            set({ isLoading: false, error: null });
            toast.success(response.data?.message || "Товар удален");
            return true;
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data?.message });
            toast.error(error.response?.data?.message);
            return false;
        }
    },

    // Новый метод с поддержкой курсора, подкатегорий и поиска по названию
    getForCatalog: async (params = {}) => {
        const { loadMore = false, name, subCategoryId } = params;
        const { userNextCursor, userProducts } = get();

        if (loadMore) {
            if (!userNextCursor) return;
            set({ isFetchingMore: true, error: null });
        } else {
            set({ isLoading: true, error: null });
        }

        try {
            const queryParams = new URLSearchParams();

            if (name) queryParams.append("name", name);
            if (subCategoryId) queryParams.append("subCategoryId", subCategoryId);
            if (loadMore && userNextCursor) queryParams.append("cursor", userNextCursor);

            const response = await api.get(`/product?${queryParams.toString()}`);
            const rawData = response.data;
            const newProducts = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData?.data)
                ? rawData.data
                : Array.isArray(rawData?.products)
                ? rawData.products
                : [];

            const nextCursor = !Array.isArray(rawData) ? (rawData?.nextCursor || null) : null;

            set({
                isLoading: false,
                isFetchingMore: false,
                userProducts: loadMore ? [...userProducts, ...newProducts] : newProducts,
                userNextCursor: nextCursor,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при получении списка продуктов";
            set({
                isLoading: false,
                isFetchingMore: false,
                userProducts: loadMore ? userProducts : [],
                error: errorMessage,
            });
            toast.error(errorMessage);
        }
    },

    getCurrentProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<any>(`/product/${id}`);
            const rawData = response.data;
            const product = rawData?.data || rawData;
            set({ isLoading: false, error: null, currentUserProduct: product });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при получении списка продуктов";
            set({
                isLoading: false,
                error: errorMessage,
            });
            toast.error(errorMessage);
        }
    },

    getSimilarProducts: async (subCategoryId: string) => {
        set({ isSimilarLoading: true });
        try {
            const response = await api.get(`/product?subCategoryId=${encodeURIComponent(subCategoryId)}`);
            const rawData = response.data;
            const products = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData?.data)
                ? rawData.data
                : Array.isArray(rawData?.products)
                ? rawData.products
                : [];

            set({ isSimilarLoading: false, similarProducts: products });
        } catch (error: any) {
            set({ isSimilarLoading: false, similarProducts: [] });
        }
    },

    clearSimilarProducts: () => {
        set({ similarProducts: [], isSimilarLoading: false });
    }
}));