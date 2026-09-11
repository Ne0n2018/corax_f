import {api} from "@/lib/api";
import {create} from "zustand/react";
import {toast} from "sonner";
import {GetUsersParams, Roles, User, UserAdmin, UserMeta} from "@/types/user";


interface UserState {
    user: User | null;
    users: UserAdmin[];
    params: GetUsersParams;
    meta: UserMeta;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;
    getMe: () => Promise<void>;
    logout: () => Promise<void>;
    updateMe: (name?: string, number?: string, birthDay?: string) => Promise<void>;
    updateAddress: (address: string) => Promise<void>;
    setParams: (params: Partial<GetUsersParams>) => void;
    getUsers: () => Promise<void>;
    updateRole: (userId: string, role: Roles) => Promise<boolean>;
    blockUser: (userId: string, message?: string) => Promise<boolean>;
    unBlockUser: (userId: string, message?: string) => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    users: [],
    isAuth: false,
    isLoading: true,
    error: null,
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    params: { page: 1, limit: 10, search: "", sortBy: "createdAt" },

    getMe: async () => {
        try {
            const response = await api.get<User>('/users/profile');
            set({ user: response.data, isAuth: true, isLoading: false });
        } catch (error) {
            set({ user: null, isAuth: false, isLoading: false });
        }
    },

    logout: async () => {
        set({ user: null, isAuth: false });
    },

    updateMe: async (name?: string, number?: string, birthDay?: string) => {
        set({ isLoading: true, error: null });

        // Формируем объект запроса только с непустыми данными
        const payload: Record<string, string> = {};

        if (name && name.trim() !== '') payload.name = name;
        if (number && number.trim() !== '') payload.number = number;
        if (birthDay && birthDay.trim() !== '') payload.birthDay = birthDay;

        // Блокируем отправку запроса, если ни одно поле не заполнено
        if (Object.keys(payload).length === 0) {
            set({ isLoading: false });
            toast.info('Нет данных для обновления');
            return;
        }

        try {
            const response = await api.put<User>('/users', payload);

            // Обновляем текущего пользователя в стейте, чтобы UI сразу отреагировал
            set({
                user: response.data,
                isLoading: false,
                error: null
            });

            toast.success('Ваша учетная запись успешно обновлена');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Произошла ошибка при обновлении';
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    updateAddress: async (address: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put<User>('/users', {
                address,
            });
            set({isLoading: false, error: null, user: response.data});
            toast.success('Ваш адресс доставки успешно обновлен')
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data.message });
            toast.error(error.response.data.message);
        }
    },

    setParams: (newParams) => {
        set((state) => ({ params: { ...state.params, ...newParams } }));
    },

    getUsers: async () => {
        set({ isLoading: true });
        const { params } = get();
        try {
            const response = await api.get("/admin/users", { params });
            set({
                users: response.data.data,
                meta: response.data.meta,
                isLoading: false,
            });
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Ошибка при загрузке пользователей");
        }
    },

    updateRole: async (userId: string, role: Roles) => {
        try {
            await api.post(`/admin/user/${userId}`, { role });
            toast.success("Роль успешно изменена");

            // Локально обновляем список
            set((state) => ({
                users: state.users.map((u) => (u.id === userId ? { ...u, role } : u)),
            }));
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Ошибка смены роли");
            return false;
        }
    },

    blockUser: async (userId: string, message?: string) => {
        try {
            await api.put(`/admin/users/block/${userId}`, { message });
            toast.success("Пользователь заблокирован");

            set((state) => ({
                users: state.users.map((u) => (u.id === userId ? { ...u, isActive: false } : u)),
            }));
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Ошибка блокировки");
            return false;
        }
    },

    unBlockUser: async (userId: string, message?: string) => {
        try {
            await api.put(`/admin/users/block/${userId}`, { message });
            toast.success("Пользователь разблокирован");

            set((state) => ({
                users: state.users.map((u) => (u.id === userId ? { ...u, isActive: false } : u)),
            }));
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Ошибка разблокировки");
            return false;
        }
    },
}));