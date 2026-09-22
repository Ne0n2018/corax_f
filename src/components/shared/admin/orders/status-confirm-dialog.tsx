'use client'

import React from 'react'
import { AdminOrderStatus } from '@/types/admin-order'
import {
    STATUS_LABELS,
    NOTIFIABLE_STATUSES,
    STATUS_COLORS,
} from './status-constants'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { ArrowRight, Mail, AlertTriangle } from 'lucide-react'

interface StatusConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderCode?: number | string
    currentStatus?: AdminOrderStatus
    targetStatus?: AdminOrderStatus | null
    onConfirm: () => void
}

export function StatusConfirmDialog({
    open,
    onOpenChange,
    orderCode,
    currentStatus,
    targetStatus,
    onConfirm,
}: StatusConfirmDialogProps) {
    if (!targetStatus || !currentStatus) return null

    const currentStyle = STATUS_COLORS[currentStatus]
    const targetStyle = STATUS_COLORS[targetStatus]
    const isEmailNotifiable = NOTIFIABLE_STATUSES.includes(targetStatus)
    const isCancel = targetStatus === AdminOrderStatus.CANCELLED

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#1E1E22] border border-gray-800 text-white rounded-3xl p-6 sm:max-w-md">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-lg font-russo text-white">
                        Подтверждение смены статуса
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-gray-400">
                        Вы собираетесь изменить статус заказа{' '}
                        <span className="font-bold text-white">№{orderCode}</span>:
                    </AlertDialogDescription>

                    {/* Визуальная цепочка перехода */}
                    <div className="flex items-center justify-center gap-2.5 py-3 px-3 bg-[#2C2C31] rounded-2xl border border-gray-800 text-xs">
                        <span
                            className={`px-2.5 py-1 rounded-full font-bold border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}
                        >
                            {STATUS_LABELS[currentStatus]}
                        </span>

                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />

                        <span
                            className={`px-2.5 py-1 rounded-full font-bold border ${targetStyle.bg} ${targetStyle.text} ${targetStyle.border}`}
                        >
                            {STATUS_LABELS[targetStatus]}
                        </span>
                    </div>

                    {/* Уведомление об отправке Email */}
                    {isEmailNotifiable && (
                        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs text-left">
                            <Mail className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                            <div>
                                <span className="font-bold">Email-уведомление:</span> покупателю будет автоматически отправлено письмо на почту с новым статусом.
                            </div>
                        </div>
                    )}

                    {/* Предупреждение об отмене */}
                    {isCancel && (
                        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs text-left">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                            <div>
                                <span className="font-bold">Внимание:</span> отмена заказа необратима. Заказ перейдет в финальный статус.
                            </div>
                        </div>
                    )}
                </AlertDialogHeader>

                <AlertDialogFooter className="flex flex-row justify-end gap-2.5 pt-4 border-t border-gray-800">
                    <AlertDialogCancel
                        variant="ghost"
                        className="bg-transparent hover:bg-[#2C2C31] text-gray-300 hover:text-white rounded-xl text-xs px-4 py-2 cursor-pointer border border-gray-700"
                    >
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={`rounded-xl text-xs font-bold px-4 py-2 text-white shadow-md cursor-pointer ${
                            isCancel
                                ? 'bg-rose-600 hover:bg-rose-700'
                                : 'bg-[#EC5B4D] hover:bg-[#d94f42]'
                        }`}
                    >
                        Подтвердить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
