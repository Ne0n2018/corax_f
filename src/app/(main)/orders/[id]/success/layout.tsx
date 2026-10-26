import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Заказ успешно оплачен — Corax",
};

export default function OrderSuccessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
