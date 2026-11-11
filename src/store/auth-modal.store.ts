import {create} from "zustand";
import type {AuthModal} from "@/components/shared/header/auth.dialog";

interface AuthModalStore {
    mode: AuthModal;
    openAuth: (mode: AuthModal) => void;
    closeAuth: () => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
    mode: null,
    openAuth: (mode) => set({mode}),
    closeAuth: () => set({mode: null}),
}));
