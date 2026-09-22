import { create } from 'zustand';
import { api } from '@/lib/api';
import { CreateOrderDto, CreateOrderResult, OrderResponse } from '@/types/order';
import { toast } from 'sonner';

interface OrderState {
    isSubmitting: boolean;
    error: string | null;
    createOrder: (dto: CreateOrderDto) => Promise<CreateOrderResult | null>;
    getOrder: (orderId: string) => Promise<OrderResponse | null>;
    getPaymentUrl: (orderId: string) => Promise<string | null>;
    cancelOrder: (orderId: string) => Promise<OrderResponse | null>;
}

export const useOrderStore = create<OrderState>((set) => ({
    isSubmitting: false,
    error: null,

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
        try {
            const response = await api.patch<OrderResponse>(`/order/${orderId}/cancel`);
            toast.success('Заказ отменен');
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Не удалось отменить заказ';
            toast.error(message);
            return null;
        }
    },
}));
