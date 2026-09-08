import {create} from "zustand";
import {Category, CategoryCreate, SubCategory} from "@/types/category";
import {api} from "@/lib/api";
import {toast} from "sonner";

interface CategoryStore {
    message: string | null;
    isLoading: boolean;
    error: string | null;
    category: SubCategory[]; // Для селектов (getForSelect)
    categories: Category[]; // Для каталога категорий с подкатегориями

    getForSelect: () => Promise<void>;
    fetchCategories: (name?: string) => Promise<void>;
    adminCreate: (data: CategoryCreate) => Promise<boolean>;
    adminUpdate: (id: string, data: any) => Promise<boolean>;
    getCategoriesById: (id: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    message: null,
    isLoading: false,
    error: null,
    category: [],
    categories: [],

    // Метод для получения всех категорий с подкатегориями (для дерева категорий)
    fetchCategories: async (name?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<Category[]>("/admin/category", {
                params: name ? { name } : undefined,
            });

            set({ isLoading: false, error: null, categories: response.data });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Ошибка загрузки категорий";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    // Твой метод для получения подкатегорий в селекты
    getForSelect: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<Category[]>("admin/sabCategory");

            set({ isLoading: false, error: null, category: response.data });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Ошибка загрузки";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
        }
    },

    adminCreate: async (data: CategoryCreate) => {
        set({ isLoading: true, error: null });

        try {
            await api.post("/admin/category", data);
            set({ isLoading: false, error: null });
            toast.success('категория успешно создана')
            return true
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.message });
            toast.error(error.response?.message);
            return false
        }
    },

    adminUpdate: async (id: string, data) => {
        set({isLoading: true})

        try {
            await api.put(`/admin/category${id}`, data)
            set({ isLoading: false });
            toast.success("Категория успешно обновлена");
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка обновления категории";
            set({ isLoading: false });
            toast.error(errorMessage);
            return false;
        }
    },

    getCategoriesById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get(`/admin/category/${id}`);
            set({ isLoading: false, error: null, categories: response.data });
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data?.message || error.message });
            toast.error(error.response?.message);
        }
    },

    deleteCategory: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.delete(`/admin/category${id}`)
            toast.success(response.data.message)
            set({ isLoading: false });
            return true
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data?.message || error.message });
            toast.error(error.response?.message);
            return false;
        }
    }

}));