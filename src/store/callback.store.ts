import { api } from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";

interface CallbackStoreProps {
    isLoading: boolean;
    error: string | null;

    callback: (phone: string) => Promise<boolean>;
}

export const useCallbackStore = create<CallbackStoreProps>((set) => ({
    isLoading: false,
    error: null,

    callback: async (phone: string) => {
        try {
            set({ isLoading: true, error: null });
             await api.post('/callback', { phone });
            set({ isLoading: false, error: null });
            toast.success("Заявка на звонок успешно отправлена");
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ошибка при вызове обратного вызова";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
            return false;
        }
    }
}))