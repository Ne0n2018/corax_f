'use client'

import {useEffect, useRef} from "react";
import {BellOff, Loader2, X} from "lucide-react";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import {cn} from "@/lib/utils";
import {useNotificationStore} from "@/store/notification.store";
import {NotificationItem} from "@/types/notification";

interface NotificationsWindowProps {
    className?: string;
    onClose: () => void;
}

const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return format(date, 'd MMM, HH:mm', {locale: ru})
}

export function NotificationsWindow({className, onClose}: NotificationsWindowProps) {
    const {items, isLoading, reload, markAllRead, remove} = useNotificationStore()

    // При открытии подтягиваем актуальный список и помечаем всё прочитанным
    const initializedRef = useRef(false)
    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true

        void (async () => {
            await reload()
            await markAllRead()
        })()
    }, [reload, markAllRead])

    return (
        <div className={cn('p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-full flex flex-col', className)}>
            {/* Заголовок раздела */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">
                        Уведомления
                    </h2>
                    <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                        Акции, новости и события вашего аккаунта
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть уведомления"
                    title="Закрыть уведомления"
                    className="shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 text-[#A0A0A2] hover:bg-[#D83C2D] hover:border-[#D83C2D] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4"/>
                </button>
            </div>

            {isLoading && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#8E8E93]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#D83C2D]"/>
                    <p className="text-xs">Загрузка уведомлений...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-gray-400">
                        <BellOff className="w-12 h-12"/>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            Уведомлений пока нет
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                            Здесь появятся акции, персональные предложения и новости аккаунта
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {items.map((item: NotificationItem) => (
                        <div
                            key={item.id}
                            className={cn(
                                'relative rounded-[13px] p-4 pr-11 border transition-colors',
                                item.read
                                    ? 'bg-[#38383D] border-transparent'
                                    : 'bg-[#3E3E45] border-[#D83C2D]/60'
                            )}
                        >
                            <p className="text-white text-xs sm:text-sm leading-snug wrap-break-word">
                                {item.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[#8E8E93] text-[11px]">
                                    {formatDate(item.createdAt)}
                                </span>
                                {!item.read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D83C2D]"/>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(item.id)}
                                aria-label="Удалить уведомление"
                                title="Удалить уведомление"
                                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[#A0A0A2] hover:bg-[#D83C2D] hover:border-[#D83C2D] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
