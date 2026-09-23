import { Container } from "@/components/ui/container";
import { Contacts } from "@/components/shared/contacts/contacts";
import { SelfPickup } from "@/components/shared/contacts/Self‑pickup";
import { PaymentInfo } from "@/components/shared/contacts/payment-info";
import { DeliveryInfo } from "@/components/shared/contacts/delivery-info";

export default function ContactsPage() {
    return (
        <Container className="my-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.75 items-stretch">
                {/* 1. Верхний левый блок: Контакты с викингом */}
                <Contacts />

                {/* 2. Верхний правый блок: Самовывоз */}
                <SelfPickup />

                {/* 3. Нижний левый блок: Оплата, Возврат и гарантии */}
                <PaymentInfo />

                {/* 4. Нижний правый блок: Доставка по Беларуси и до двери */}
                <DeliveryInfo />
            </div>
        </Container>
    );
}