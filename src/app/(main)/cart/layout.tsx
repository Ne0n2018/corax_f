import type {Metadata} from "next";
import CartLayoutClient from "./layout-client";

// Корзина — клиентская страница, поэтому title задаётся в серверном layout,
// а защита авторизации осталась в клиентском layout-client.
export const metadata: Metadata = {
    title: "Корзина — Corax",
};

export default function CartLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <CartLayoutClient>{children}</CartLayoutClient>
}
