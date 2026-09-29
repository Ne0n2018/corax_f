import { create } from 'zustand';
import { api } from '@/lib/api';
import { CreateOrderDto, CreateOrderResult, OrderResponse } from '@/types/order';
import { AddToCart } from '@/types/cart';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart.store';

interface OrderState {
    orders: OrderResponse[];
    isLoadingOrders: boolean;
    isSubmitting: boolean;
    // id заказа, для которого сейчас выполняется отмена / повтор
    cancellingOrderId: string | null;
    repeatingOrderId: string | null;
    error: string | null;
    getUserOrders: () => Promise<OrderResponse[]>;
    createOrder: (dto: CreateOrderDto) => Promise<CreateOrderResult | null>;
    getOrder: (orderId: string) => Promise<OrderResponse | null>;
    getPaymentUrl: (orderId: string) => Promise<string | null>;
    cancelOrder: (orderId: string) => Promise<OrderResponse | null>;
    repeatOrder: (order: OrderResponse) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    isLoadingOrders: false,
    isSubmitting: false,
    cancellingOrderId: null,
    repeatingOrderId: null,
    error: null,

    getUserOrders: async () => {
        set({ isLoadingOrders: true, error: null });
        try {
            const response = await api.get<OrderResponse[]>('/order');
            set({ orders: response.data || [], isLoadingOrders: false });
            return response.data || [];
        } catch (error: any) {
            const message = error.response?.data?.message || 'Не удалось загрузить заказы';
            set({ isLoadingOrders: false, error: message });
            return [];
        }
    },

    createOrder: async (dto: CreateOrderDto) => {
        set({ isSubmitting: true, error: null });
        try {
            const response = await api.post<CreateOrderResult>('/order', dto);
            set({ isSubmitting: false });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Ошибка при оформлении заказа';
            set({ isSubmitting: false, error: message });
            toast.error(message);
            return null;
        }
    },

    getOrder: async (orderId: string) => {
        try {
            const response = await api.get<OrderResponse>(`/order/${orderId}`);
            return response.data;
        } catch (error: any) {
            console.error('Ошибка получения заказа:', error);
            return null;
        }
    },

    getPaymentUrl: async (orderId: string) => {
        try {
            const response = await api.get<{ redirectUrl: string }>(`/order/${orderId}/pay`);
            return response.data.redirectUrl;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Не удалось получить ссылку для оплаты';
            toast.error(message);
            return null;
        }
    },

    cancelOrder: async (orderId: string) => {
        set({ cancellingOrderId: orderId });
        try {
            const response = await api.patch<OrderResponse>(`/order/${orderId}/cancel`);
            toast.success('Заказ отменен');
            // Обновляем заказ в списке, чтобы статус поменялся без перезагрузки
            set((state) => ({
                cancellingOrderId: null,
                orders: state.orders.map((order) => (order.id === orderId ? response.data : order)),
            }));
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Не удалось отменить заказ';
            toast.error(message);
            set({ cancellingOrderId: null });
            return null;
        }
    },

    // Повтор заказа: добавляем позиции прошлого заказа в корзину
    repeatOrder: async (order: OrderResponse) => {
        const orderItems = (order.items || []).filter((item) => item.productId);

        if (orderItems.length === 0) {
            toast.error('Не удалось повторить заказ: нет данных о товарах');
            return false;
        }

        const { addToCart } = useCartStore.getState();
        set({ repeatingOrderId: order.id });

        let added = 0;
        let failed = 0;

        for (const item of orderItems) {
            const dto: AddToCart = {
                productId: item.productId as string,
                price: Number(item.price || 0),
                taste: item.taste || 'Стандартный',
                size: item.size || 'Стандартный',
            };

            // Корзина добавляет по одной единице за запрос
            const quantity = Math.max(1, Number(item.quantity) || 1);
            for (let i = 0; i < quantity; i++) {
                try {
                    await addToCart(dto, true);
                    added++;
                } catch {
                    failed++;
                }
            }
        }

        set({ repeatingOrderId: null });

        if (added === 0) {
            toast.error('Не удалось добавить товары заказа в корзину');
            return false;
        }

        if (failed > 0) {
            toast.warning(`Добавлено ${added} шт., часть товаров недоступна`);
        } else {
            toast.success('Товары из заказа добавлены в корзину');
        }

        return true;
    },
}));
