import {create} from "zustand";
import {api} from "@/lib/api";
import {toast} from "sonner";
import {useUserStore} from "@/store/user.store";

interface AuthStore {
    message: string | null;
    isLoading: boolean;
    error: string | null;
    auth: (name: string, email: string, password: string, passwordRepeat: string) => Promise<void>;
    login: ( email: string, password: string) => Promise<void>;
    passwordRecovery: ( email: string) => Promise<void>;
    newPassword: (token: string, password: string) => Promise<void>;
    emailConfirm: ( token: string ) => Promise<void>;
    logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set)=>({
    message: null,
    isLoading: false,
    error: null,

    auth: async (name: string, email: string, password: string, passwordRepeat: string) => {
        set({isLoading: true, error: null,})

        try {
            const response = await api.post('auth/register', {
                name,
                email,
                password,
                passwordRepeat
            })

            set({isLoading: false, error: null, message: `${response.data.message}`})
            toast.success(response.data.message)
        } catch (error: any) {
            set({isLoading: false, error: error.response?.data?.message})
            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message)
            }
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        set({isLoading: true, error: null,})

        try {
            const response = await api.post('auth/login', {
                email,
                password,
            })
            if (response.status === 200){
                useUserStore.getState().getMe()
            }
            set({isLoading: false, error: null, message: `${response.data.message}`})
            toast.success(response.data.message)
        } catch (error: any){
            set({isLoading: false, error: error.response?.data?.message})
            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message)
            }
            throw error;
        }
    },

    passwordRecovery: async (email: string) => {
        set({isLoading: true, error: null,})

         try {
              await api.post('auth/password-recovery/reset', {
                 email,
             })
             set({isLoading: false, error: null,})
         } catch (error: any) {
            set({isLoading: false, error: error.response?.data?.message})
         }
     },

    newPassword: async (token: string, password: string) => {
        set({isLoading: true, error: null,})

        try {
            const response = await api.post(`auth/password-recovery/new/${token}`, {
                password,
            })
            set({isLoading: false, error: null,})
            toast.success(response.data.message)
        } catch (error: any) {
            set({isLoading: false, error: error.response?.data?.message})
            toast.error(error.response?.data?.message)
            throw error;
        }
    },

    emailConfirm: async (token: string) => {
        set({isLoading: true, error: null,})

        try {
             await api.post(`auth/email-confirmation`, {
                token,
            })
            set({isLoading: false, error: null})
        } catch (error: any) {
            set({isLoading: false, error: error.response?.data?.message})
            toast.error(error.response?.data?.message)
        }
    },

    logOut: async () =>{
        set({isLoading: true, error: null})

        try {
            await api.post('auth/logout', {})
            set({isLoading: false, error: null})
            toast.success('успешный выход из аккаунта')
            useUserStore.getState().logout()
        } catch (error: any) {
            set({isLoading:false, error: error.response?.data?.message})
            toast.error(error.response?.data?.message)
        }
    }
}));