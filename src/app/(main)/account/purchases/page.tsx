import type {Metadata} from "next";
import { PurchasesWindow } from "@/components/shared/account/right-window/purchases";

export const metadata: Metadata = {
    title: "Мои покупки — Corax",
};

export default function AccountPurchasesPage() {
    return <PurchasesWindow className="w-full" />
}
