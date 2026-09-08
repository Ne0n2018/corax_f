'use client'

import React, {useEffect,} from "react";
import {useUserStore} from "@/store/user.store";
import useIsMounted from "@/hooks/use-is-mounted";

export function AppLoader({ children }: { children: React.ReactNode }) {
    const { getMe, isLoading } = useUserStore();
   const isMounted = useIsMounted()

    useEffect(() => {
        getMe();
    }, []);

    // Показываем лоадер, пока клиент не смонтирован или идет запрос за профилем
    if (!isMounted || isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#1E1E24]">
                <span className="text-white text-lg font-russo animate-pulse">Загрузка...</span>
            </div>
        );
    }

    // Когда всё готово, рендерим само приложение
    return <>{children}</>;
}