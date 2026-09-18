export enum DeliveryType {
    PICKUP   = 'PICKUP',
    DELIVERY = 'DELIVERY',
    BELMAIL  = 'BELMAIL',
    EUROMAIL = 'EUROMAIL',
}

export enum PaymentType {
    ONLINE = 'ONLINE',
    CASH   = 'CASH',
    CARD   = 'CARD',
}

export interface CreateOrderDto {
    deliveryType: DeliveryType;
    address?: string;
    paymentType: PaymentType;
    promoCode?: string;
}

export interface OrderResponse {
    id: string;
    userId: string;
    deliveryType: DeliveryType;
    paymentType: PaymentType;
    address?: string;
    status: string;
    totalAmount: number;
    subtotalAmount: number;
    discountAmount: number;
    deliveryPrice: number;
    promoCode?: string;
    createdAt?: string;
}

export interface CreateOrderResult {
    order: OrderResponse;
    redirectUrl?: string | null;
}
