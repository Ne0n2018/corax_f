import {create} from "zustand";
import {io, type Socket} from "socket.io-client";
import {api} from "@/lib/api";
import {toast} from "sonner";
import {NotificationItem, NotificationSocketPayload} from "@/types/notification";

// Соединение живёт вне стора, чтобы не попадать в сериализуемое состояние
let socket: Socket | null = null;
// Обработчик возврата фокуса на вкладку — синхронизирует список и счётчик
let focusHandler: (() => void) | null = null;

const removeFocusHandler = () => {
    if (focusHandler && typeof window !== 'undefined') {
        window.removeEventListener('focus', focusHandler);
    }
    focusHandler = null;
};

interface NotificationState {
    items: NotificationItem[];
    unread: number;
    isLoading: boolean;
    error: string | null;

    connect: () => void;
    disconnect: () => void;
    reload: () => Promise<void>;
    markAllRead: () => Promise<void>;
    remove: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    items: [],
    unread: 0,
    isLoading: false,
    error: null,

    connect: () => {
        // Сокет уже создан — повторно не подключаемся
        if (socket) return;

        const socketUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        if (!socketUrl) return;

        socket = io(socketUrl, {
            withCredentials: true, // обязательна сессионная cookie
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
        });

        socket.on('notification', (payload: NotificationSocketPayload) => {
            // У общего (broadcast) уведомления нет id — подтягиваем актуальный список
            if (!payload.id) {
        void get().reload();

        // Список не обновляется сам при действиях в другой вкладке — синхронизируем по фокусу
        if (typeof window !== 'undefined' && !focusHandler) {
            focusHandler = () => {
                void get().reload();
            };
            window.addEventListener('focus', focusHandler);
        }
                return;
            }

            const notificationId = payload.id;

            set((state) => {
                // Защита от дублей, если список уже успел обновиться
                if (state.items.some((item) => item.id === notificationId)) {
                    return state;
                }

                return {
                    items: [
                        {
                            id: notificationId,
                            message: payload.message,
                            type: payload.type,
                            event: payload.event || null,
                            meta: payload.meta,
                            read: payload.read,
                            createdAt: payload.createdAt,
                        },
                        ...state.items,
                    ],
                    unread: payload.read ? state.unread : state.unread + 1,
                };
            });
        });

        void get().reload();
    },

    disconnect: () => {
        socket?.disconnect();
        socket = null;
        removeFocusHandler();
        set({items: [], unread: 0, isLoading: false, error: null});
    },

    reload: async () => {
        set({isLoading: true, error: null});
        try {
            const [list, counter] = await Promise.all([
                api.get<NotificationItem[]>('/notifications'),
                api.get<{ count: number }>('/notifications/unread-count'),
            ]);
            set({items: list.data, unread: counter.data.count, isLoading: false});
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Ошибка при загрузке уведомлений',
            });
        }
    },

    markAllRead: async () => {
        const {items, unread} = get();
        if (unread === 0 && !items.some((item) => !item.read)) return;

        // Оптимистично помечаем прочитанными, чтобы бейдж исчез сразу
        set((state) => ({
            items: state.items.map((item) => ({...item, read: true})),
            unread: 0,
        }));

        try {
            await api.patch('/notifications/read-all');
        } catch (error: any) {
            set({error: error.response?.data?.message || 'Ошибка при отметке уведомлений'});
            await get().reload();
        }
    },

    remove: async (id: string) => {
        const target = get().items.find((item) => item.id === id);

        // Оптимистично убираем из списка
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            unread: target && !target.read ? Math.max(0, state.unread - 1) : state.unread,
        }));

        try {
            await api.delete(`/notifications/${id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Не удалось удалить уведомление');
            await get().reload();
        }
    },
}));
