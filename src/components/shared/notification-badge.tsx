'use client'

import {cn} from "@/lib/utils";

interface NotificationBadgeProps {
    count: number;
    /** Цвет обводки вокруг бейджа (обычно совпадает с фоном кнопки). */
    ringColor?: string;
    className?: string;
}

/**
 * Красный счётчик непрочитанных уведомлений.
 * Позиционируется абсолютно — родитель должен иметь класс `relative`.
 */
export function NotificationBadge({count, ringColor = '#2C2C31', className}: NotificationBadgeProps) {
    if (count <= 0) return null

    return (
        <span
            className={cn(
                "pointer-events-none absolute -top-2 -right-2 z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D83C2D] px-1 text-[10px] font-bold leading-none text-white",
                className
            )}
            style={{boxShadow: `0 0 0 2px ${ringColor}`}}
        >
            {count > 99 ? '99+' : count}
        </span>
    )
}
