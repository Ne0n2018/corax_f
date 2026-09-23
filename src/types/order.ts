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

export enum OrderStatus {
    PENDING    = 'PENDING',
    PAID       = 'PAID',
    PROCESSING = 'PROCESSING',
    SHIPPED    = 'SHIPPED',
    DELIVERED  = 'DELIVERED',
    CANCELLED  = 'CANCELLED',
}

export interface OrderItem {
    id: string;
    productId?: string;
    productItemId?: string;
    productName: string;
    imageUrl?: string;
    taste?: string;
    size?: string;
    price: number;
    quantity: number;
}

export interface CreateOrderDto {
    deliveryType: DeliveryType;
    address?: string;
    paymentType: PaymentType;
    promoCode?: string;
    recipientName?: string;
    recipientPhone?: string;
}

export interface OrderResponse {
    id: string;
    orderCode?: number;
    userId: string;
    deliveryType: DeliveryType;
    paymentType: PaymentType;
    address?: string | null;
    status: OrderStatus | string;
    totalAmount: number;
    subtotalAmount: number;
    discountAmount: number;
    deliveryPrice: number;
    promoCode?: string;
    items?: OrderItem[];
    createdAt?: string;
}

export interface CreateOrderResult {
    order: OrderResponse;
    redirectUrl?: string | null;
}
