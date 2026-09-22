import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { AdminOrder, AdminOrderStatus, OrdersFilter, OrdersListResponse, OrdersMeta } from '@/types/admin-order';
import { toast } from 'sonner';

interface AdminOrdersState {
    socket: Socket | null;
    isConnected: boolean;
    isLoading: boolean;
    orders: AdminOrder[];
    meta: OrdersMeta;
    filter: OrdersFilter;
    selectedOrder: AdminOrder | null;
    isDetailLoading: boolean;

    connect: () => void;
    disconnect: () => void;
    fetchOrders: (customFilter?: Partial<OrdersFilter>) => void;
    setFilter: (newFilter: Partial<OrdersFilter>) => void;
    getOrderDetails: (orderId: string) => void;
    updateOrderStatus: (orderId: string, status: AdminOrderStatus) => void;
    closeOrderDetails: () => void;
}

const DEFAULT_META: OrdersMeta = {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
};

const DEFAULT_FILTER: OrdersFilter = {
    page: 1,
    limit: 20,
    status: '',
    search: '',
};

export const useAdminOrdersStore = create<AdminOrdersState>((set, get) => ({
    socket: null,
    isConnected: false,
    isLoading: false,
    orders: [],
    meta: DEFAULT_META,
    filter: DEFAULT_FILTER,
    selectedOrder: null,
    isDetailLoading: false,

    connect: () => {
        const currentSocket = get().socket;
        if (currentSocket?.connected) return;

        // Определяем базовый URL и путь сокета
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
        const socketHost = serverUrl.replace(/\/api\/?$/, '');
        const socketPath = serverUrl.endsWith('/api') ? '/api/socket.io' : '/socket.io';

        const socket = io(`${socketHost}/admin/orders`, {
            path: socketPath,
            transports: ['websocket'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            set({ isConnected: true });
            get().fetchOrders();
        });

        socket.on('disconnect', () => {
            set({ isConnected: false });
        });

        socket.on('connect_error', (error) => {
            console.error('[AdminOrders WS] Connect error:', error);
            set({ isConnected: false, isLoading: false });
        });

        socket.on('orders:list', (data: OrdersListResponse) => {
            set({
                orders: data.orders,
                meta: data.meta,
                isLoading: false,
            });
        });

        socket.on('orders:detail', (order: AdminOrder) => {
            set({
                selectedOrder: order,
                isDetailLoading: false,
            });
        });

        socket.on('orders:statusUpdated', (updatedOrder: AdminOrder) => {
            set((state) => ({
                orders: state.orders.map((o) =>
                    o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
                ),
                selectedOrder:
                    state.selectedOrder?.id === updatedOrder.id
                        ? { ...state.selectedOrder, ...updatedOrder }
                        : state.selectedOrder,
            }));
            toast.success(`Статус заказа №${updatedOrder.orderCode} обновлен: ${updatedOrder.status}`);
        });

        socket.on('orders:error', (data: { message?: string }) => {
            toast.error(data.message || 'Ошибка обработки запроса заказов');
            set({ isLoading: false, isDetailLoading: false });
        });

        set({ socket });
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.removeAllListeners();
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },

    fetchOrders: (customFilter?: Partial<OrdersFilter>) => {
        const socket = get().socket;
        const currentFilter = { ...get().filter, ...customFilter };

        set({ isLoading: true, filter: currentFilter });

        if (!socket || !socket.connected) {
            return;
        }

        const payload: Record<string, unknown> = {
            page: currentFilter.page || 1,
            limit: currentFilter.limit || 20,
        };

        if (currentFilter.status) {
            payload.status = currentFilter.status;
        }

        if (currentFilter.search?.trim()) {
            payload.search = currentFilter.search.trim();
        }

        socket.emit('orders:getAll', payload);
    },

    setFilter: (newFilter: Partial<OrdersFilter>) => {
        const updated = { ...get().filter, ...newFilter };
        // При смене поиска или статуса сбрасываем страницу на 1
        if (newFilter.search !== undefined || newFilter.status !== undefined) {
            updated.page = 1;
        }
        get().fetchOrders(updated);
    },

    getOrderDetails: (orderId: string) => {
        const socket = get().socket;
        set({ isDetailLoading: true });

        if (!socket || !socket.connected) {
            toast.error('Нет подключения к серверу');
            set({ isDetailLoading: false });
            return;
        }

        socket.emit('orders:getById', { orderId });
    },

    updateOrderStatus: (orderId: string, status: AdminOrderStatus) => {
        const socket = get().socket;

        if (!socket || !socket.connected) {
            toast.error('Нет подключения к серверу');
            return;
        }

        socket.emit('orders:updateStatus', { orderId, status });
    },

    closeOrderDetails: () => {
        set({ selectedOrder: null, isDetailLoading: false });
    },
}));
