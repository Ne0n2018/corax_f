import type {Metadata} from "next";

// Карточка товара открывается модалкой через слот @modal, поэтому
// заголовок статический: данные товара на этой странице не загружаются.
export const metadata: Metadata = {
    title: "Товар — Corax",
};

export default function Page () {
    return (
        <div></div>
    )
}