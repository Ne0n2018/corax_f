import { DeliveryType, PaymentType } from './order';

export enum AdminOrderStatus {
    PENDING    = 'PENDING',
    PAID       = 'PAID',
    PROCESSING = 'PROCESSING',
    SHIPPED    = 'SHIPPED',
    DELIVERED  = 'DELIVERED',
    CANCELLED  = 'CANCELLED',
}

export interface AdminOrderItem {
    id: string;
    orderId: string;
    productItemId?: string;
    productName: string;
    imageUrl?: string;
    taste?: string;
    size?: string;
    price: number;
    quantity: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdminOrder {
    id: string;
    orderCode: number;
    userId: string;
    deliveryType: DeliveryType | string;
    paymentType: PaymentType | string;
    status: AdminOrderStatus;
    totalAmount: number;
    subtotalAmount: number;
    discountAmount: number;
    deliveryPrice: number;
    promoCode?: string | null;
    address?: string | null;
    createdAt: string;
    updatedAt: string;
    items?: AdminOrderItem[];
    user?: {
        id: string;
        email: string;
        displayName?: string;
        phone?: string;
    };
}

export interface OrdersMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface OrdersListResponse {
    orders: AdminOrder[];
    meta: OrdersMeta;
}

export interface OrdersFilter {
    page?: number;
    limit?: number;
    status?: AdminOrderStatus | '';
    search?: string;
}
