export type NotificationCategory =
    | 'DISCOUNT'
    | 'PROMO'
    | 'ACCOUNT'
    | 'ORDER_DECORATED'
    | 'ORDER_RECEIVED'

/** Уведомление из REST API. */
export interface NotificationItem {
    id: string
    message: string
    type: NotificationCategory
    event: string | null
    meta: Record<string, unknown>
    read: boolean
    createdAt: string
}

/** Сообщение из WebSocket (у общего уведомления id === null). */
export interface NotificationSocketPayload {
    id: string | null
    event: string
    message: string
    type: NotificationCategory
    read: boolean
    meta: Record<string, unknown>
    createdAt: string
}
