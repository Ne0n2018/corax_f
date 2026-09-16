import {create} from "zustand";
import {TopProduct} from "@/types/topProduct";
import {toast} from "sonner";
import {api} from "@/lib/api";

interface TopProductStoreProps {
    isLoading: boolean;
    error: string | null;
    topProducts: TopProduct[];

    getTopProducts: () => Promise<void>;
}

export const useTopProductStore = create<TopProductStoreProps>((set) => ({
    isLoading: false,
    error: null,
    topProducts: [],

    getTopProducts: async () => {
        set({isLoading: true});
        try {
            const response = await api.get<TopProduct[]>('/top-products');
            set({isLoading: false, topProducts: response.data});
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при получении списка акций";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage)
        }
    }
}));