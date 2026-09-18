import {create} from "zustand";
import {AddToCart, CartResponse} from "@/types/cart";
import {toast} from "sonner";
import {api} from "@/lib/api";

interface useCartStoreProps {
    cart: CartResponse | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;

    getCart: () => Promise<void>;
    addToCart: (dto: AddToCart, silent?: boolean) => Promise<void>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<useCartStoreProps>((set, get) => ({
    cart: null,
    isLoading: false,
    isUpdating: false,
    error: null,

    getCart: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await api.get('/cart');
            set({cart: response.data, isLoading: false});
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при получении корзины";
            set({
                isLoading: false,
                error: errorMessage,
            });
        }
    },

    addToCart: async (dto: AddToCart, silent = false) => {
        set({isLoading: true, error: null});
        try {
            await api.post('/cart', dto);
            await get().getCart();
            set({isLoading: false});
            if (!silent) {
                toast.success("Товар добавлен в корзину");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при добавлении в корзину";
            set({
                isLoading: false,
                error: errorMessage,
            });
            toast.error(errorMessage);
            throw error;
        }
    },

    updateQuantity: async (cartItemId: string, quantity: number) => {
        if (quantity < 1) {
            return get().removeFromCart(cartItemId);
        }

        // Оптимистичное обновление, чтобы интерфейс реагировал мгновенно и не стирал состояние
        const currentCart = get().cart;
        if (currentCart && currentCart.CartItem) {
            const updatedItems = currentCart.CartItem.map((item) =>
                item.id === cartItemId ? { ...item, quantity } : item
            );
            const updatedTotal = updatedItems.reduce(
                (sum, item) => sum + item.productItem.price * item.quantity,
                0
            );
            set({
                cart: {
                    ...currentCart,
                    CartItem: updatedItems,
                    totalAmount: updatedTotal,
                },
                isUpdating: true,
                error: null,
            });
        }

        try {
            await api.patch(`/cart/${cartItemId}`, { quantity });
            await get().getCart();
            set({isUpdating: false});
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при изменении количества";
            set({isUpdating: false, error: errorMessage});
            toast.error(errorMessage);
            get().getCart();
        }
    },

    removeFromCart: async (cartItemId: string) => {
        // Оптимистичное удаление
        const currentCart = get().cart;
        if (currentCart && currentCart.CartItem) {
            const updatedItems = currentCart.CartItem.filter((item) => item.id !== cartItemId);
            const updatedTotal = updatedItems.reduce(
                (sum, item) => sum + item.productItem.price * item.quantity,
                0
            );
            set({
                cart: {
                    ...currentCart,
                    CartItem: updatedItems,
                    totalAmount: updatedTotal,
                },
                isUpdating: true,
                error: null,
            });
        }

        try {
            await api.delete(`/cart/${cartItemId}`);
            await get().getCart();
            set({isUpdating: false});
            toast.success("Товар удален из корзины");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при удалении товара";
            set({isUpdating: false, error: errorMessage});
            toast.error(errorMessage);
            get().getCart();
        }
    },

    clearCart: async () => {
        const currentCart = get().cart;
        if (currentCart) {
            set({
                cart: { ...currentCart, CartItem: [], totalAmount: 0 },
                isUpdating: true,
                error: null,
            });
        }

        try {
            await api.delete('/cart/clear');
            await get().getCart();
            set({isUpdating: false});
            toast.success("Корзина очищена");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при очистке корзины";
            set({isUpdating: false, error: errorMessage});
            toast.error(errorMessage);
            get().getCart();
        }
    },
}));