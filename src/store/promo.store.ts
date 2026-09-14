import {create} from "zustand";
import {Promo, PromoCreate, PromoUpdate} from "@/types/promo";
import {toast} from "sonner";
import {api} from "@/lib/api";
import {cleanSubcategories} from "@/lib/utils";

interface PromoStoreProps {
    isLoading: boolean;
    error: string | null;
    promos: Promo[];
    promo: Promo | null;
    editingPromo: Promo | null;

    setEditingPromo: (promo: Promo | null) => void;
    create: (data: PromoCreate) => Promise<boolean>;
    getAllPromos: () => Promise<void>;
    update: (id: string, data: PromoUpdate) => Promise<boolean>;
    delete: (id: string) => Promise<boolean>;
}

export const usePromoStore = create<PromoStoreProps>((set) => ({
    isLoading: false,
    error: null,
    promos: [],
    promo: null,
    editingPromo: null,

    setEditingPromo: (promo) => set({ editingPromo: promo }),

    create: async (data: PromoCreate) => {
        set({isLoading: true});

        try {
            const response = await api.post('admin/promo', data);
            set({isLoading: false});
            toast.success(response.data.message);
            return true;
        } catch (error: any) {
            set({isLoading: false});
            toast.error(error.response?.message);
            return false;
        }
    },

    getAllPromos: async () => {
        set({isLoading: true});
        try {
            const response = await api.get('/admin/promo');
            set({isLoading: false, promos: response.data});
        } catch (error: any) {
            set({isLoading: false});
            toast.error(error.response?.message);
        }
    },

    update: async (id: string, data: PromoUpdate) => {
        set({ isLoading: true });

        const payload = {
            ...data,
            applicableSubcategories: cleanSubcategories(data.applicableSubcategories),
        };

        try {
            const response = await api.put(`admin/promo/${id}`, payload);
            set({ isLoading: false });
            toast.success(response.data.message);
            return true;
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    },

    delete: async (id: string) => {
        set({isLoading: true})
        try {
            const response = await api.delete(`admin/promo/${id}`);
            set({isLoading: false});
            toast.success(response.data.message);
            return true;
        } catch (error: any) {
            set({isLoading: false})
            toast.error(error.response?.message)
            return false;
        }
    }
}));