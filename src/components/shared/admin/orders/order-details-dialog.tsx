'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useAdminOrdersStore } from '@/store/admin-orders.store'
import { AdminOrderStatus } from '@/types/admin-order'
import { DeliveryType } from '@/types/order'
import {
    getNextAllowedStatuses,
    isUserControlledStatus,
    STATUS_LABELS,
    STATUS_COLORS,
} from './status-constants'
import { StatusConfirmDialog } from './status-confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Package, MapPin, CreditCard, ShoppingBag, Calendar, User, Tag, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'

export function OrderDetailsDialog() {
    const { selectedOrder, isDetailLoading, closeOrderDetails, updateOrderStatus } =
        useAdminOrdersStore()

    const [pendingTargetStatus, setPendingTargetStatus] = useState<AdminOrderStatus | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    if (!selectedOrder && !isDetailLoading) return null

    const getDeliveryLabel = (type?: string) => {
        switch (type) {
            case DeliveryType.PICKUP:
                return 'Самовывоз из магазина'
            case DeliveryType.EUROMAIL:
                return 'Европочта'
            case DeliveryType.DELIVERY:
            default:
                return 'Курьерская доставка'
        }
    }

    const orderNumber = selectedOrder?.orderCode || selectedOrder?.id.slice(0, 8)
    const allowedNextStatuses = selectedOrder
        ? getNextAllowedStatuses(selectedOrder.status, selectedOrder.deliveryType)
        : []
    const isUserControlled = selectedOrder ? isUserControlledStatus(selectedOrder.status) : false
    const isDelivered = selectedOrder?.status === AdminOrderStatus.DELIVERED
    const isCancelled = selectedOrder?.status === AdminOrderStatus.CANCELLED
    const currentStyle = selectedOrder ? STATUS_COLORS[selectedOrder.status] : null

    const handleSelectStatus = (newStatus: string | null) => {
        if (!newStatus || !selectedOrder || newStatus === selectedOrder.status) return
        setPendingTargetStatus(newStatus as AdminOrderStatus)
        setIsConfirmOpen(true)
    }

    const handleConfirmStatusChange = () => {
        if (selectedOrder && pendingTargetStatus) {
            updateOrderStatus(selectedOrder.id, pendingTargetStatus)
            setIsConfirmOpen(false)
            setPendingTargetStatus(null)
        }
    }

    return (
        <>
            <Dialog open={Boolean(selectedOrder || isDetailLoading)} onOpenChange={(open) => !open && closeOrderDetails()}>
                <DialogContent className="max-w-2xl bg-[#1E1E22] border border-gray-800 text-white p-6 rounded-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-3 border-b border-gray-800/80">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-russo text-white">
                                Заказ №{orderNumber}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    {isDetailLoading || !selectedOrder ? (
                        <div className="py-16 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-[#EC5B4D] animate-spin mb-3" />
                            <p className="text-xs text-gray-400">Загрузка информации о заказе...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 pt-2">
                            {/* Статус заказа и цепочка изменения через Shadcn Select */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2C2C31] p-4 rounded-2xl border border-gray-800">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Текущий статус</p>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                                            currentStyle?.bg || 'bg-[#EC5B4D]/20'
                                        } ${currentStyle?.text || 'text-[#EC5B4D]'} ${
                                            currentStyle?.border || 'border-[#EC5B4D]/30'
                                        }`}
                                    >
                                        {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Статус:</span>
                                    {isUserControlled ? (
                                        <div
                                            className="px-3 py-1.5 rounded-xl bg-[#1E1E22] border border-amber-800/50 text-amber-300 text-xs font-medium flex items-center gap-1.5"
                                            title="Статус зависит от покупателя (оплата). Администратор не может изменить его вручную."
                                        >
                                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span>Ожидает оплаты</span>
                                        </div>
                                    ) : isDelivered ? (
                                        <div className="px-3 py-1.5 rounded-xl bg-[#1E1E22] border border-teal-800/50 text-teal-300 text-xs font-medium flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                            <span>Заказ завершён</span>
                                        </div>
                                    ) : isCancelled ? (
                                        <div className="px-3 py-1.5 rounded-xl bg-[#1E1E22] border border-rose-800/50 text-rose-300 text-xs font-medium flex items-center gap-1.5">
                                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                            <span>Заказ отменён</span>
                                        </div>
                                    ) : (
                                        <div className="w-[190px]">
                                            <Select
                                                value={selectedOrder.status}
                                                onValueChange={handleSelectStatus}
                                            >
                                                <SelectTrigger className="w-full bg-[#1E1E22] hover:bg-[#25252b] border-gray-700 text-white text-xs h-9 rounded-xl cursor-pointer">
                                                    <SelectValue>
                                                        {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1E1E22] border-gray-700 text-white rounded-xl shadow-xl">
                                                    <SelectItem
                                                        value={selectedOrder.status}
                                                        disabled
                                                        className="text-gray-400 text-xs font-semibold py-1.5"
                                                    >
                                                        Текущий: {STATUS_LABELS[selectedOrder.status]}
                                                    </SelectItem>
                                                    {allowedNextStatuses.map((nextStatus) => (
                                                        <SelectItem
                                                            key={nextStatus}
                                                            value={nextStatus}
                                                            className={`text-xs py-1.5 cursor-pointer rounded-lg hover:bg-[#2C2C31] ${
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
                                </div>
                            </div>

                            {/* Инфо-сетка */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="bg-[#2C2C31] p-3.5 rounded-2xl border border-gray-800 space-y-1">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar className="w-4 h-4 text-[#EC5B4D]" />
                                        <span>Дата оформления</span>
                                    </div>
                                    <p className="font-semibold text-white">
                                        {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
                                    </p>
                                </div>

                                <div className="bg-[#2C2C31] p-3.5 rounded-2xl border border-gray-800 space-y-1">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <User className="w-4 h-4 text-[#EC5B4D]" />
                                        <span>Клиент</span>
                                    </div>
                                    <p className="font-semibold text-white truncate" title={selectedOrder.userId}>
                                        {selectedOrder.user?.displayName || selectedOrder.user?.email || selectedOrder.userId}
                                    </p>
                                </div>

                                <div className="bg-[#2C2C31] p-3.5 rounded-2xl border border-gray-800 space-y-1">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Package className="w-4 h-4 text-[#EC5B4D]" />
                                        <span>Способ доставки</span>
                                    </div>
                                    <p className="font-semibold text-white">
                                        {getDeliveryLabel(selectedOrder.deliveryType)}
                                    </p>
                                </div>

                                <div className="bg-[#2C2C31] p-3.5 rounded-2xl border border-gray-800 space-y-1">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <CreditCard className="w-4 h-4 text-[#EC5B4D]" />
                                        <span>Способ оплаты</span>
                                    </div>
                                    <p className="font-semibold text-white">
                                        {selectedOrder.paymentType === 'ONLINE' ? 'Онлайн (bePaid)' : selectedOrder.paymentType}
                                    </p>
                                </div>

                                {selectedOrder.address && (
                                    <div className="sm:col-span-2 bg-[#2C2C31] p-3.5 rounded-2xl border border-gray-800 space-y-1">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin className="w-4 h-4 text-[#EC5B4D]" />
                                            <span>Адрес доставки</span>
                                        </div>
                                        <p className="font-semibold text-white">{selectedOrder.address}</p>
                                    </div>
                                )}

                                {selectedOrder.promoCode && (
                                    <div className="sm:col-span-2 bg-[#2C2C31] p-3.5 rounded-2xl border border-gray-800 flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-emerald-400" />
                                        <span className="text-gray-400">Применен промокод:</span>
                                        <span className="font-bold text-emerald-400">{selectedOrder.promoCode}</span>
                                    </div>
                                )}
                            </div>

                            {/* Состав заказа с красивым скроллом */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Состав заказа ({selectedOrder.items?.length || 0})
                                </p>
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {selectedOrder.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between text-xs bg-[#2C2C31] p-3 rounded-2xl border border-gray-800"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {item.imageUrl ? (
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.productName}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-xl object-contain bg-white shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-[#1E1E22] flex items-center justify-center shrink-0">
                                                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-white truncate">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {item.quantity} шт. {item.taste ? `• ${item.taste}` : ''}{' '}
                                                        {item.size ? `• ${item.size}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 pl-3">
                                                <p className="font-bold text-white">
                                                    {(item.price * item.quantity).toFixed(2)} р.
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    {item.price.toFixed(2)} р./шт
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Финансовый итог */}
                            <div className="bg-[#2C2C31] p-4 rounded-2xl border border-gray-800 space-y-2 text-xs">
                                <div className="flex justify-between text-gray-400">
                                    <span>Товары ({selectedOrder.items?.length || 0}):</span>
                                    <span>{Number(selectedOrder.subtotalAmount || selectedOrder.totalAmount).toFixed(2)} р.</span>
                                </div>
                                {Number(selectedOrder.discountAmount) > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Скидка:</span>
                                        <span>-{Number(selectedOrder.discountAmount).toFixed(2)} р.</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-400">
                                    <span>Доставка:</span>
                                    <span>
                                        {Number(selectedOrder.deliveryPrice) > 0
                                            ? `${Number(selectedOrder.deliveryPrice).toFixed(2)} р.`
                                            : 'Бесплатно'}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-gray-700/60 flex justify-between items-center text-sm">
                                    <span className="font-bold text-white">Итого к оплате:</span>
                                    <span className="font-black text-[#EC5B4D] text-base">
                                        {Number(selectedOrder.totalAmount).toFixed(2)} р.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Диалог подтверждения смены статуса */}
            {selectedOrder && (
                <StatusConfirmDialog
                    open={isConfirmOpen}
                    onOpenChange={setIsConfirmOpen}
                    orderCode={orderNumber}
                    currentStatus={selectedOrder.status}
                    targetStatus={pendingTargetStatus}
                    onConfirm={handleConfirmStatusChange}
                />
            )}
        </>
    )
}
