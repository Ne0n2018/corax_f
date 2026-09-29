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

// Заказы «в работе»: всё, что еще не доставлено и не отменено
export const ACTIVE_ORDER_STATUSES: string[] = [
    OrderStatus.PENDING,
    OrderStatus.PAID,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
];

// Завершенные заказы — история покупок
export const COMPLETED_ORDER_STATUSES: string[] = [OrderStatus.DELIVERED];

// Заказ создан, но еще не оплачен: доступна отмена и повторная оплата
export const isOrderUnpaid = (status: string): boolean => status === OrderStatus.PENDING;

export const isOrderInWork = (status: string): boolean => ACTIVE_ORDER_STATUSES.includes(status);

export const isOrderCompleted = (status: string): boolean => COMPLETED_ORDER_STATUSES.includes(status);

export interface OrderStatusInfo {
    label: string;
    className: string;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
    [OrderStatus.PENDING]: 'Ожидает оплаты',
    [OrderStatus.PAID]: 'Оплачен',
    [OrderStatus.PROCESSING]: 'Собирается',
    [OrderStatus.SHIPPED]: 'В пути',
    [OrderStatus.DELIVERED]: 'Доставлен',
    [OrderStatus.CANCELLED]: 'Отменен',
};

// Метка и цвета плашки статуса (светлые — используются на белых карточках товаров)
export function getOrderStatusInfo(status?: string): OrderStatusInfo {
    const key = status || '';
    const label = ORDER_STATUS_LABELS[key] || 'В работе';

    switch (key) {
        case OrderStatus.PENDING:
            return { label, className: 'bg-amber-100 text-amber-900' };
        case OrderStatus.DELIVERED:
            return { label, className: 'bg-emerald-100 text-emerald-900' };
        case OrderStatus.CANCELLED:
            return { label, className: 'bg-gray-200 text-gray-500' };
        case OrderStatus.SHIPPED:
            return { label, className: 'bg-[#E5E5EA] text-[#3A3A3C]' };
        default:
            return { label, className: 'bg-[#E5E5EA] text-[#3A3A3C]' };
    }
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
