import type {Metadata} from "next";

// Каталог — клиентская страница, поэтому title задаётся в серверном layout.
export const metadata: Metadata = {
    title: "Каталог — Corax",
};

export default function CatalogLayout({children}: {children: React.ReactNode}) {
    return children;
}
