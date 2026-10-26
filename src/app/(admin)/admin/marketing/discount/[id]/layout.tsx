import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Редактирование акции — Панель администратора",
};

export default function AdminEditPromotionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
