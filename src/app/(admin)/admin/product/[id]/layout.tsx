import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Редактирование товара — Панель администратора",
};

export default function AdminEditProductLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
