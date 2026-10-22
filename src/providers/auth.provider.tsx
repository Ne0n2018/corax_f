"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user.store";
import { useNotificationStore } from "@/store/notification.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Профиль загружает AppLoader (он оборачивает этот провайдер), поэтому
    // повторный getMe здесь не нужен — иначе уходит второй запрос /users/profile
    const user = useUserStore((state) => state.user);
    const connectNotifications = useNotificationStore((state) => state.connect);
    const disconnectNotifications = useNotificationStore((state) => state.disconnect);

    // WebSocket уведомлений подключаем после входа и рвём при выходе
    useEffect(() => {
        if (user) {
            connectNotifications();
        }

        return () => {
            disconnectNotifications();
        };
    }, [user, connectNotifications, disconnectNotifications]);

    return <>{children}</>;
}