"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const getMe = useUserStore((state) => state.getMe);

    useEffect(() => {
        getMe();
    }, [getMe]);

    return <>{children}</>;
}