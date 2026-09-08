import {create} from "zustand";
import {api} from "@/lib/api";
import {toast} from "sonner";
import {Provider, Providers} from "@/types/provider";

interface ProviderStore {
    message: string | null;
    isLoading: boolean;
    error: string | null;
    provider: Provider[];
    providers: Providers[];
    oneProvider: Providers | null;

    getForSelect: (name?: string) => Promise<void>;
    getAll: (name?: string) => Promise<void>;
    getById: (id: string) => Promise<void>;
    adminCreate: (data: FormData) => Promise<boolean>;
    adminUpdate: ( id: string, data: FormData) => Promise<boolean>;
    adminDelete: (id: string) => Promise<boolean>;
}

export const useProviderStore = create<ProviderStore>((set)=>({
    message: null,
    isLoading: false,
    error: null,
    provider: [],
    providers: [],
    oneProvider: null,

    getForSelect: async (name?: string) => {
        set({ isLoading: true, error: null });
        try {

            const params = new URLSearchParams();

            if (name) params.append("name", name);

            const response = await api.get<Provider[]>(`admin/provider?${params.toString()}`);


            set({isLoading: false, error: null, provider: response.data});
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data.message });

            toast.error(error.response?.data.message);
        }
    },

    getAll: async (name?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<Providers[]>(`admin/provider?name=${name}`);
            set({isLoading: false, error: null, providers: response.data});
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data.message });
            toast.error(error.response?.data.message);
        }
    },

    getById: async (id: string) =>{
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<Providers>(`admin/provider${id}`);
            set({isLoading: false, error: null, oneProvider: response.data});
        }  catch (error: any) {
            set({ isLoading: false, error: error.response?.data.message });
            toast.error(error.response?.data.message);
        }
    },

    adminCreate: async (data: FormData) => {
        set({ isLoading: true });
        try {
            await api.post("/admin/provider", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({ isLoading: false });
            toast.success("Поставщик успешно создан");
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при создании поставщика";
            set({ isLoading: false });
            toast.error(errorMessage);
            return false;
        }
    },

    adminUpdate: async (id: string, data: FormData) => {
        set({ isLoading: true });
        try {
            await api.put(`/admin/provider${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({ isLoading: false });
            toast.success("Поставщик успешно обновлен");
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при обновлении поставщика";
            set({ isLoading: false });
            toast.error(errorMessage);
            return false;
        }
    },

    adminDelete: async (id: string)=> {
        set({ isLoading: true });
        try {
            const response = await api.delete(`/admin/provider${id}`);
            toast.success(response?.data.message);
            set({isLoading: false})
            return true;
        } catch (error: any) {
            set({isLoading: false})
            toast.error(error.response?.data.message);
            return false;
        }
}
}));