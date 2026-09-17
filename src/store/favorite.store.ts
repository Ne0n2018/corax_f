import {create} from "zustand";
import {api} from "@/lib/api";
import {toast} from "sonner";

interface FavoriteItemResponse {
    productId: string;
}

interface FavoriteStoreProps {
    isLoading: boolean;
    error: string | null;
    favoriteProductId: string[];

    addToFavorite: (productId: string) => Promise<void>;
    getFavorite: () => Promise<void>;
    deleteFavorite: (id: string) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteStoreProps>((set) => ({
    isLoading: false,
    error: null,
    favoriteProductId: [],

    addToFavorite: async (productId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/favorite', { productId });

            set((state) => {
                const isAlreadyFavorite = state.favoriteProductId.includes(productId);
                const updatedFavorites = isAlreadyFavorite
                    ? state.favoriteProductId.filter((id) => id !== productId)
                    : [...state.favoriteProductId, productId];

                return {
                    isLoading: false,
                    error: null,
                    favoriteProductId: updatedFavorites,
                };
            });

            toast.success(response.data?.message || "Товар добавлен в избранное");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при изменении избранного";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    getFavorite: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<FavoriteItemResponse[]>('/favorite/favorites');
            const cleanIds = response.data.map((item) => item.productId);

            set({ isLoading: false, error: null, favoriteProductId: cleanIds });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при получении избранных";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    deleteFavorite: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.delete(`/favorite/${id}`);

            // Фильтруем массив и удаляем проданный/убранный ID из локального стора
            set((state) => ({
                isLoading: false,
                error: null,
                favoriteProductId: state.favoriteProductId.filter((productId) => productId !== id),
            }));

            toast.success(response.data?.message || "Товар удален из избранного");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при удалении из избранного";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    }
}));