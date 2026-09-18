import { create } from 'zustand';
import { api } from '@/lib/api';
import { CreateOrderDto, CreateOrderResult } from '@/types/order';
import { toast } from 'sonner';

interface OrderState {
    isSubmitting: boolean;
    error: string | null;
    createOrder: (dto: CreateOrderDto) => Promise<CreateOrderResult | null>;
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
}));
