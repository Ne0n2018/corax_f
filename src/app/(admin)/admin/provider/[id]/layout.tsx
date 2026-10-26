import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Редактирование поставщика — Панель администратора",
};

export default function AdminEditProviderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
