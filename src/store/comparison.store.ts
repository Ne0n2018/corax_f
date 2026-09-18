import {create} from "zustand";
import {api} from "@/lib/api";
import {toast} from "sonner";

interface ComparisonStoreProps {
    isLoading: boolean;
    comparisonProductIds: string[];
    getComparison: () => Promise<void>;
    addToComparison: (productId: string) => Promise<void>;
    removeFromComparison: (productId: string) => Promise<void>;
    toggleComparison: (productId: string) => Promise<void>;
}

export const useComparisonStore = create<ComparisonStoreProps>((set, get) => ({
    isLoading: false,
    comparisonProductIds: [],

    getComparison: async () => {
        try {
            const response = await api.get('/comparison');
            const ids = Array.isArray(response.data) 
                ? response.data.map((item: any) => item.productId || item.id) 
                : [];
            set({ comparisonProductIds: ids });
        } catch {
            // Ошибка игнорируется (например, если пользователь не авторизован)
        }
    },

    addToComparison: async (productId: string) => {
        try {
            await api.post('/comparison', { productId });
            set((state) => ({
                comparisonProductIds: [...state.comparisonProductIds, productId],
            }));
            toast.success("Товар добавлен в сравнение");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Ошибка при добавлении в сравнение");
        }
    },

    removeFromComparison: async (productId: string) => {
        try {
            await api.delete(`/comparison/${productId}`);
            set((state) => ({
                comparisonProductIds: state.comparisonProductIds.filter((id) => id !== productId),
            }));
            toast.success("Товар удален из сравнения");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Ошибка при удалении из сравнения");
        }
    },

    toggleComparison: async (productId: string) => {
        const isCompared = get().comparisonProductIds.includes(productId);
        if (isCompared) {
            await get().removeFromComparison(productId);
        } else {
            await get().addToComparison(productId);
        }
    },
}));
