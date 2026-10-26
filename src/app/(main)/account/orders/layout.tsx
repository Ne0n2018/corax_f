import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Мои заказы — Corax",
};

export default function AccountOrdersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
