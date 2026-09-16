import {create} from "zustand";
import {api} from "@/lib/api";
import {toast} from "sonner";
import {GetPromotionsParams, Promotion, PromotionCreate} from "@/types/promotion";

interface PromotionStoreProps {
    isLoading: boolean;
    error: string | null;
    promotion: Promotion | null;
    promotions: Promotion[];
    total: number;
    page: number;
    limit: number;

    create: (data: PromotionCreate) => Promise<boolean>;
    getAll: (params?: GetPromotionsParams) => Promise<void>;
    getById: (id: string) => Promise<void>;
    update: (id: string, data: Partial<PromotionCreate>) => Promise<boolean>;
    deletePromotion: (id: string) => Promise<boolean>;
    getActive: () => Promise<void>;
}

export const usePromotionStore = create<PromotionStoreProps>((set) => ({
    isLoading: false,
    error: null,
    promotion: null,
    promotions: [],
    total: 0,
    page: 1,
    limit: 20,

    create: async (data: PromotionCreate) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            const appendIfPresent = (key: string, value: any) => {
                if (value !== null && value !== undefined && value !== "") {
                    formData.append(key, value instanceof File ? value : String(value));
                }
            };

            if (data.image) formData.append("image", data.image);
            appendIfPresent("name", data.name);
            appendIfPresent("description", data.description);
            appendIfPresent("type", data.type);
            appendIfPresent("discountMethod", data.discountMethod);
            appendIfPresent("discountValue", data.discountValue);
            appendIfPresent("buyQuantity", data.buyQuantity);
            appendIfPresent("getQuantity", data.getQuantity);
            appendIfPresent("popularTopN", data.popularTopN);
            appendIfPresent("active", data.active);
            appendIfPresent("expiresAt", data.expiresAt);

            const response = await api.post("/admin/promotion", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            set({ isLoading: false });
            toast.success(response.data?.message || "Акция успешно создана");
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при создании акции";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
            return false;
        }
    },

    getAll: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(
                    ([_, value]) => value !== undefined && value !== null && value !== ""
                )
            );

            const response = await api.get<{ items: Promotion[]; total: number }>("/admin/promotion", {
                params: cleanParams,
            });

            set({
                promotions: response.data.items,
                total: response.data.total,
                page: params.page ?? 1,
                limit: params.limit ?? 20,
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при получении списка акций";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    getById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<Promotion>(`/admin/promotion/${id}`);
            set({isLoading: false, promotion: response.data});
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при получении списка акций";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage)
        }
    },

    update: async (id: string, data: Partial<PromotionCreate>) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            const appendIfPresent = (key: string, value: any) => {
                if (value !== null && value !== undefined && value !== "") {
                    formData.append(key, value instanceof File ? value : String(value));
                }
            };

            if (data.image instanceof File) {
                formData.append("image", data.image);
            }

            appendIfPresent("name", data.name);
            appendIfPresent("description", data.description);
            appendIfPresent("type", data.type);
            appendIfPresent("discountMethod", data.discountMethod);
            appendIfPresent("discountValue", data.discountValue);
            appendIfPresent("buyQuantity", data.buyQuantity);
            appendIfPresent("getQuantity", data.getQuantity);
            appendIfPresent("popularTopN", data.popularTopN);
            appendIfPresent("active", data.active);
            appendIfPresent("expiresAt", data.expiresAt);

            const response = await api.put(`/admin/promotion/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            set((state) => ({
                isLoading: false,
                promotions: state.promotions.map((p) =>
                    p.id === id ? { ...p, ...response.data } : p
                ),
            }));

            toast.success(response.data.message);
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при обновлении акции";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
            return false;
        }
    },

    deletePromotion: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.delete(`/admin/promotion/${id}`);

            set((state) => ({
                isLoading: false,
                promotions: state.promotions.filter((p) => p.id !== id),
                total: state.total - 1,
            }));

            toast.success(response.data.message);
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при удалении акции";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
            return false;
        }
    },

    getActive: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/promotions/active');
            set({isLoading: false, promotions: response.data});
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при удалении акции";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    }
}));