'use client'

import React, {useEffect,} from "react";
import {useUserStore} from "@/store/user.store";
import {useTopLoader} from "nextjs-toploader";

export function AppLoader({ children }: { children: React.ReactNode }) {
    const getMe = useUserStore((state) => state.getMe);
    const isLoading = useUserStore((state) => state.isLoading);

    // Методы прогресс-бара стабильны, поэтому их можно безопасно указывать в зависимостях
    const {start, done} = useTopLoader();

    useEffect(() => {
        getMe();
    }, [getMe]);

    // Пока грузится профиль — вместо экрана загрузки показываем прогресс-бар
    useEffect(() => {
        if (isLoading) {
            start();
        } else {
            done();
        }
    }, [isLoading, start, done]);

    // Прогресс-бар рисует сам NextTopLoader, поэтому вместо экрана загрузки
    // оставляем пустой контейнер на всю высоту (чтобы футер не «прыгал»)
    if (isLoading) {
        return <div className="min-h-screen w-full" />;
    }

    // Когда всё готово, рендерим само приложение
    return <>{children}</>;
}