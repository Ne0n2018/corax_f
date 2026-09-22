'use client'

import React, { useState } from 'react'
import { AdminOrder, AdminOrderStatus } from '@/types/admin-order'
import { DeliveryType } from '@/types/order'
import { useAdminOrdersStore } from '@/store/admin-orders.store'
import {
    getNextAllowedStatuses,
    isUserControlledStatus,
    STATUS_LABELS,
    STATUS_COLORS,
} from './status-constants'
import { StatusConfirmDialog } from './status-confirm-dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Package, MapPin, Calendar, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react'

interface OrderCardProps {
    order: AdminOrder
}

export function OrderCard({ order }: OrderCardProps) {
    const { updateOrderStatus, getOrderDetails } = useAdminOrdersStore()
    const [pendingTargetStatus, setPendingTargetStatus] = useState<AdminOrderStatus | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const statusStyle = STATUS_COLORS[order.status] || {
        bg: 'bg-gray-800',
        text: 'text-gray-300',
        border: 'border-gray-700',
    }

    const getDeliveryLabel = (type?: string) => {
        switch (type) {
            case DeliveryType.PICKUP:
                return 'Самовывоз'
            case DeliveryType.EUROMAIL:
                return 'Европочта'
            case DeliveryType.DELIVERY:
            default:
                return 'Курьер'
        }
    }

    const allowedNextStatuses = getNextAllowedStatuses(order.status, order.deliveryType)
    const isUserControlled = isUserControlledStatus(order.status)
    const isDelivered = order.status === AdminOrderStatus.DELIVERED
    const isCancelled = order.status === AdminOrderStatus.CANCELLED

    const handleSelectStatus = (newStatus: string | null) => {
        if (!newStatus || newStatus === order.status) return
        setPendingTargetStatus(newStatus as AdminOrderStatus)
        setIsConfirmOpen(true)
    }

    const handleConfirmStatusChange = () => {
        if (pendingTargetStatus) {
            updateOrderStatus(order.id, pendingTargetStatus)
            setIsConfirmOpen(false)
            setPendingTargetStatus(null)
        }
    }

    const orderNumber = order.orderCode || order.id.slice(0, 8)
    const formattedDate = new Date(order.createdAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <>
            <div className="bg-[#1E1E22] hover:bg-[#232328] border border-gray-800/80 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Левая часть: номер, дата, доставка, адрес */}
                <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-russo text-base sm:text-lg text-white">
                            №{orderNumber}
                        </span>

                        <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                            {STATUS_LABELS[order.status] || order.status}
                        </span>

                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-[#EC5B4D]" />
                            <span>{getDeliveryLabel(order.deliveryType)}</span>
                        </div>

                        {order.address && (
                            <div className="flex items-center gap-1.5 max-w-md truncate" title={order.address}>
                                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                <span className="truncate">{order.address}</span>
                            </div>
                        )}

                        {order.items && order.items.length > 0 && (
                            <span className="text-gray-500">
                                • Позиций: {order.items.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Правая часть: сумма, управление статусом, кнопка просмотра */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-800">
                    <div className="text-left sm:text-right mr-1">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Сумма</p>
                        <p className="font-black text-sm sm:text-base text-white">
                            {Number(order.totalAmount).toFixed(2)} р.
                        </p>
                    </div>

                    {/* Управление статусом */}
                    {isUserControlled ? (
                        <div
                            className="px-3 py-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 select-none"
                            title="Статус зависит от действий покупателя (оплата). Администратор не может изменить его вручную."
                        >
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Ожидает оплаты</span>
                        </div>
                    ) : isDelivered ? (
                        <div className="px-3 py-2 rounded-xl bg-teal-950/30 border border-teal-800/40 text-teal-300 text-xs font-medium flex items-center gap-1.5 select-none">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>Завершён</span>
                        </div>
                    ) : isCancelled ? (
                        <div className="px-3 py-2 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs font-medium flex items-center gap-1.5 select-none">
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>Отменён</span>
                        </div>
                    ) : (
                        <div className="w-[185px]">
                            <Select
                                value={order.status}
                                onValueChange={handleSelectStatus}
                            >
                                <SelectTrigger className="w-full bg-[#2C2C31] hover:bg-[#35353B] border-gray-700 text-white text-xs h-9.5 rounded-xl cursor-pointer">
                                    <SelectValue>
                                        {STATUS_LABELS[order.status] || order.status}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-[#2C2C31] border-gray-700 text-white rounded-xl shadow-xl">
                                    <SelectItem
                                        value={order.status}
                                        disabled
                                        className="text-gray-400 text-xs font-semibold py-1.5"
                                    >
                                        Текущий: {STATUS_LABELS[order.status]}
                                    </SelectItem>
                                    {allowedNextStatuses.map((nextStatus) => (
                                        <SelectItem
                                            key={nextStatus}
                                            value={nextStatus}
                                            className={`text-xs py-1.5 cursor-pointer rounded-lg hover:bg-[#3A3A40] ${
                                                nextStatus === AdminOrderStatus.CANCELLED
                                                    ? 'text-rose-400 focus:text-rose-300'
                                                    : 'text-white'
                                            }`}
                                        >
                                            → {STATUS_LABELS[nextStatus]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Кнопка открытия деталей */}
                    <button
                        type="button"
                        onClick={() => getOrderDetails(order.id)}
                        className="p-2.5 bg-[#46464E] hover:bg-[#56565f] text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        title="Подробнее о заказе"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Диалог подтверждения смены статуса */}
            <StatusConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                orderCode={orderNumber}
                currentStatus={order.status}
                targetStatus={pendingTargetStatus}
                onConfirm={handleConfirmStatusChange}
            />
        </>
    )
}
