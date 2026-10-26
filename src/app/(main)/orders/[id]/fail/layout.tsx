import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Оплата не завершена — Corax",
};

export default function OrderFailLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
