"use client";

import {useEffect} from "react";
import {ErrorPage} from "@/components/shared/error-page/error-page";

export default function MainError({
                                      error,
                                      reset,
                                  }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Логируем ошибку для отладки
        console.error(error);
    }, [error]);

    return (
        <ErrorPage
            code="500"
            title="Что-то пошло не так"
            description="На сервере произошла ошибка. Мы уже знаем о проблеме — попробуйте обновить страницу чуть позже."
            onRetry={reset}
        />
    );
}
