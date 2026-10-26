import type {Metadata} from "next";
import AccountLayoutClient from "./layout-client";

// Личный кабинет — клиентская страница, поэтому title задаётся в серверном
// layout. Он же служит дефолтом для вложенных разделов ЛК.
export const metadata: Metadata = {
    title: "Личный кабинет — Corax",
};

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AccountLayoutClient>{children}</AccountLayoutClient>
}
