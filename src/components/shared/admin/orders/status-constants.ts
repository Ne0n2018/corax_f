import { AdminOrderStatus } from '@/types/admin-order'
import { DeliveryType } from '@/types/order'

export const STATUS_LABELS: Record<AdminOrderStatus, string> = {
    [AdminOrderStatus.PENDING]: 'Ожидает оплаты',
    [AdminOrderStatus.PAID]: 'Оплачен',
    [AdminOrderStatus.PROCESSING]: 'В сборке / Обработке',
    [AdminOrderStatus.SHIPPED]: 'Отправлен',
    [AdminOrderStatus.DELIVERED]: 'Завершён',
    [AdminOrderStatus.CANCELLED]: 'Отменён',
}

/**
 * Проверка, зависит ли статус исключительно от пользователя (например, ожидание оплаты).
 * Администратор не может переводить заказ из этого статуса вручную.
 */
export function isUserControlledStatus(status: AdminOrderStatus): boolean {
    return status === AdminOrderStatus.PENDING
}

/**
 * Определение доступных следующих статусов по цепочке:
 * 1. PENDING: зависит от пользователя — администратор его НЕ меняет (возвращает []).
 * 2. Самовывоз (PICKUP): товара нет в доставке курьером, поэтому следующий статус — ТОЛЬКО DELIVERED (Завершён) или CANCELLED.
 * 3. Обычная доставка (курьер, европочта, белпочта): PAID -> PROCESSING -> SHIPPED -> DELIVERED (с возможностью CANCELLED на промежуточных этапах).
 * 4. DELIVERED / CANCELLED: конечные статусы (возвращает []).
 */
export function getNextAllowedStatuses(
    status: AdminOrderStatus,
    deliveryType?: DeliveryType | string
): AdminOrderStatus[] {
    // 1. Статус зависит от пользователя — не меняем
    if (isUserControlledStatus(status)) {
        return []
    }

    // 2. Конечные статусы — больше не меняются
    if (status === AdminOrderStatus.DELIVERED || status === AdminOrderStatus.CANCELLED) {
        return []
    }

    const isPickup = deliveryType === DeliveryType.PICKUP || deliveryType === 'PICKUP'

    // 3. Самовывоз — следующий статус ТОЛЬКО Завершён (или Отмена)
    if (isPickup) {
        if (status === AdminOrderStatus.PAID || status === AdminOrderStatus.PROCESSING) {
            return [AdminOrderStatus.DELIVERED, AdminOrderStatus.CANCELLED]
        }
        return []
    }

    // 4. Обычная доставка
    switch (status) {
        case AdminOrderStatus.PAID:
            return [AdminOrderStatus.PROCESSING, AdminOrderStatus.CANCELLED]
        case AdminOrderStatus.PROCESSING:
            return [AdminOrderStatus.SHIPPED, AdminOrderStatus.CANCELLED]
        case AdminOrderStatus.SHIPPED:
            return [AdminOrderStatus.DELIVERED, AdminOrderStatus.CANCELLED]
        default:
            return []
    }
}

/**
 * Статусы, при переходе в которые бэкенд автоматически отправляет
 * email-уведомление покупателю на почту (согласно backend NOTIFIABLE_STATUSES).
 */
export const NOTIFIABLE_STATUSES: AdminOrderStatus[] = [
    AdminOrderStatus.SHIPPED,
    AdminOrderStatus.DELIVERED,
    AdminOrderStatus.CANCELLED,
]

export const STATUS_COLORS: Record<AdminOrderStatus, { bg: string; text: string; border: string }> = {
    [AdminOrderStatus.PENDING]: {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-800/60',
    },
    [AdminOrderStatus.PAID]: {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-800/60',
    },
    [AdminOrderStatus.PROCESSING]: {
        bg: 'bg-blue-950/40',
        text: 'text-blue-400',
        border: 'border-blue-800/60',
    },
    [AdminOrderStatus.SHIPPED]: {
        bg: 'bg-purple-950/40',
        text: 'text-purple-400',
        border: 'border-purple-800/60',
    },
    [AdminOrderStatus.DELIVERED]: {
        bg: 'bg-teal-950/40',
        text: 'text-teal-400',
        border: 'border-teal-800/60',
    },
    [AdminOrderStatus.CANCELLED]: {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-800/60',
    },
}
