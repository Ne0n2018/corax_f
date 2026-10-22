"use client";

import {useEffect} from "react";
import {ErrorPage} from "@/components/shared/error-page/error-page";

export default function AdminError({
                                       error,
                                       reset,
                                   }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <ErrorPage
            code="500"
            title="Ошибка в панели управления"
            description="Не удалось загрузить раздел админ-панели. Попробуйте повторить запрос."
            onRetry={reset}
        />
    );
}
