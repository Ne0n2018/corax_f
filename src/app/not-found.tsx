import type {Metadata} from "next";
import {ErrorPage} from "@/components/shared/error-page/error-page";

export const metadata: Metadata = {
    title: "Страница не найдена — Corax",
};

export default function RootNotFound() {
    return (
        <ErrorPage
            code="404"
            title="Страница не найдена"
            description="Похоже, такой страницы не существует или она была перемещена. Проверьте адрес или вернитесь на главную."
        />
    );
}
