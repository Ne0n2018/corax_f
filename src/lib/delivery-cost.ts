import { DeliveryType } from '@/types/order';

/**
 * Тарифы доставки. Значения совпадают с константой бэкенда COURIER_DELIVERY_COST
 * (src/order/delivery-cost.ts) и нужны только для предпросмотра на шаге оформления.
 *
 * Финальную стоимость доставки для конкретного заказа всегда берите из ответа
 * сервера: поле order.deliveryCost. Клиент не может передать свою цену доставки.
 */
export const COURIER_DELIVERY_COST = 15;

export const DELIVERY_COSTS: Record<DeliveryType, number> = {
    [DeliveryType.PICKUP]: 0,
    [DeliveryType.DELIVERY]: COURIER_DELIVERY_COST,
    [DeliveryType.BELMAIL]: 0,
    [DeliveryType.EUROMAIL]: 0,
};

// Стоимость доставки по тарифу для предпросмотра до ответа POST /order
export function getDeliveryCost(deliveryType?: DeliveryType | string | null): number {
    if (!deliveryType) return 0;
    return DELIVERY_COSTS[deliveryType as DeliveryType] ?? 0;
}

// Формат BYN: всегда два знака, само число не меняем
export function formatMoney(value: unknown): string {
    const numeric = Number(value);
    return `${(Number.isFinite(numeric) ? numeric : 0).toFixed(2)} р.`;
}
