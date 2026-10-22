'use client'

import {useEffect, useRef} from "react";
import {ArrowLeft, BellOff, Loader2, X} from "lucide-react";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogHeader} from "@/components/ui/dialog";
import {useNotificationStore} from "@/store/notification.store";
import {NotificationItem} from "@/types/notification";
import {cn} from "@/lib/utils";

interface NotificationProps {
    onSwitchToAccount: () => void;
    onClose: () => void;
}

const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return format(date, 'd MMM, HH:mm', {locale: ru})
}

export function Notification({onSwitchToAccount, onClose}: NotificationProps) {
    const {items, isLoading, reload, markAllRead, remove} = useNotificationStore()

    // При открытии панели подтягиваем актуальный список и помечаем всё прочитанным
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
        <>
            <DialogHeader className="flex justify-between flex-row bg-white items-center">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="bg-white text-black border border-black rounded-[15px] p-3"
                        onClick={() => onSwitchToAccount()}
                        aria-label="Назад в меню"
                    >
                        <ArrowLeft/>
                    </Button>
                    <h2 className="text-black font-sans font-bold text-[16px]">Уведомления</h2>
                </div>
                <DialogClose
                    className="text-black absolute bg-white p-4.5 rounded-[20px] -left-18 top-2 hover:bg-[#4C4C55] hover:text-white"
                    onClick={() => onClose()}
                >
                    <X/>
                </DialogClose>
            </DialogHeader>

            <div className="flex flex-col gap-3.75 mt-5 max-h-[60vh] overflow-y-auto pr-1">
                {isLoading && items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#737373]">
                        <Loader2 className="w-7 h-7 animate-spin text-[#D83C2D]"/>
                        <p className="text-[12px]">Загрузка уведомлений...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <div className="w-14 h-14 rounded-full bg-[#F3F3F3] flex items-center justify-center text-[#B3B3B3] mb-3">
                            <BellOff className="w-6 h-6"/>
                        </div>
                        <p className="text-black font-sans font-bold text-[14px] mb-1">Уведомлений пока нет</p>
                        <p className="text-[#737373] font-sans text-[12px]">Здесь появятся акции и новости вашего аккаунта</p>
                    </div>
                ) : (
                    items.map((item: NotificationItem) => (
                        <div
                            key={item.id}
                            className={cn(
                                "relative rounded-[13px] border p-4 pr-10",
                                item.read
                                    ? "bg-white border-[#E1E1E1]"
                                    : "bg-[#FDF4F3] border-[#D83C2D]/30",
                            )}
                        >
                            <p className="text-black font-sans text-[13px] leading-snug wrap-break-word">
                                {item.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[#737373] font-sans text-[11px]">
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
                                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white border border-[#E1E1E1] text-[#737373] hover:bg-[#D83C2D] hover:border-[#D83C2D] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3"/>
                            </button>
                        </div>
                    ))
                )}
            </div>

        </>
    );
}
