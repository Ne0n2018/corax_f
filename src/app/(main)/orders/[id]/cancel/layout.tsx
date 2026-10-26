import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Оплата отменена — Corax",
};

export default function OrderCancelLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children;
}
