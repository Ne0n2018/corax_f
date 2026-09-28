import {create} from "zustand";
import {api} from "@/lib/api";
import {toast} from "sonner";
import { FavoriteItem, FavoriteItemResponse, Product, UserFavorite } from "@/types/favorite";



interface FavoriteStoreProps {
    isLoading: boolean;
    error: string | null;
    favoriteProductId: string[];
    userFavorite: UserFavorite | null;

    addToFavorite: (productId: string) => Promise<void>;
    getFavorite: () => Promise<void>;
    deleteFavorite: (id: string) => Promise<void>;
    getUserFavorute: () => Promise<void>;
}

export const useFavoriteStore = create<FavoriteStoreProps>((set) => ({
    isLoading: false,
    error: null,
    favoriteProductId: [],
    userFavorite: null,

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

    getUserFavorute: async () => {
    set({ isLoading: true, error: null });
    try {
        const response = await api.get<FavoriteItem[]>('/favorite');
        // Проверяем, развернул ли axios/интерцептор response.data
        const rawData = response.data !== undefined ? response.data : response;

        // Извлекаем массив чисто товаров Product[] из структуры [{ id, product: {...} }]
        const productsList: Product[] = Array.isArray(rawData)
            ? rawData.map((item) => item.product).filter(Boolean)
            : [];

        set({
            isLoading: false,
            userFavorite: { product: productsList },
            favoriteProductId: productsList.map((p) => p.id),
        });
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Ошибка при получении избранного";
        set({ 
            isLoading: false, 
            error: errorMessage, 
            userFavorite: { product: [] } 
        });
        toast.error(errorMessage);
    }
},

deleteFavorite: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
        const response = await api.delete(`/favorite/${productId}`);
        const responseData = response.data ?? response;

        // Мгновенно удаляем товар из локального стора
        set((state) => ({
            isLoading: false,
            error: null,
            favoriteProductId: state.favoriteProductId.filter((id) => id !== productId),
            userFavorite: state.userFavorite
                ? {
                      product: state.userFavorite.product.filter((p) => p.id !== productId),
                  }
                : null,
        }));

        toast.success(responseData?.message || "Товар удален из избранного");
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Ошибка при удалении из избранного";
        set({ isLoading: false, error: errorMessage });
        toast.error(errorMessage);
    }
}
}));