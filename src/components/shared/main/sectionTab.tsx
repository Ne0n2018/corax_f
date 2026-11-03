import {cn} from "@/lib/utils";
import React from "react";

type SectionTabSide = "top-left" | "bottom-right";
type SectionTabVariant = "default" | "wide";

interface SectionTabProps {
    /** Где расположен выступ относительно основной части секции. */
    side: SectionTabSide;
    /** Цвет заливки — должен совпадать с bg-color основной части секции. */
    fill: string;
    className?: string;
    /** Контент выступа (например, заголовок). */
    children?: React.ReactNode;
    /**
     * "wide" сдвигает шов вправо (десктоп): верхний выступ шире, нижний — уже.
     * Используется на стыке 3→4, где снизу длинная белая секция.
     */
    variant?: SectionTabVariant;
}

// Общая геометрия швов. Кривая у соседних выступов должна совпадать —
// это один шов: top-left рисует заливку слева от кривой, bottom-right — справа.
const TAB_PATHS: Record<SectionTabSide, { mobile: string; desktop: string }> = {
    "top-left": {
        mobile: "M 0,65 L 0,20 Q 0,0 20,0 L 180,0 C 205,0 235,65 255,65 Z",
        desktop: "M 0,100 L 0,22 Q 0,0 22,0 L 380,0 C 425,0 470,100 520,100 Z",
    },
    "bottom-right": {
        mobile: "M 180,0 C 205,0 235,65 255,65 L 355,65 Q 375,65 375,45 L 375,0 Z",
        desktop: "M 380,0 C 425,0 470,100 520,100 L 1178,100 Q 1200,100 1200,78 L 1200,0 Z",
    },
};

// Шов 3→4: кривая сдвинута вправо — белая секция короче,
// тёмный выступ шире (в нём заголовок с подзаголовком).
const TAB_PATHS_WIDE: Record<SectionTabSide, { mobile: string; desktop: string }> = {
    "top-left": {
        mobile: TAB_PATHS["top-left"].mobile,
        desktop: "M 0,100 L 0,22 Q 0,0 22,0 L 620,0 C 665,0 710,100 760,100 Z",
    },
    "bottom-right": {
        mobile: TAB_PATHS["bottom-right"].mobile,
        desktop: "M 620,0 C 665,0 710,100 760,100 L 1178,100 Q 1200,100 1200,78 L 1200,0 Z",
    },
};

// Зона, в которой текст гарантированно лежит на заливке выступа.
// items-center центрует текст по высоте; pt/pb возвращают центр закрашенной
// области (компенсация скругления 22px у срезанного угла).
const LABEL_LAYOUT: Record<SectionTabVariant, Record<SectionTabSide, string>> = {
    default: {
        "top-left":
            "top-0 left-0 items-center max-w-[165px] md:max-w-[330px] pl-3 pt-5 md:pl-5 md:pt-5.5",
        "bottom-right":
            "bottom-0 right-0 items-center max-w-[130px] md:max-w-[560px] pr-3 pb-5 md:pr-6 md:pb-5.5",
    },
    wide: {
        "top-left":
            "top-0 left-0 items-center max-w-[150px] md:max-w-[600px] pl-3 pt-5 md:pl-5 md:pt-5.5",
        "bottom-right":
            "bottom-0 right-0 items-center max-w-[130px] md:max-w-[460px] pr-3 pb-5 md:pr-6 md:pb-5.5",
    },
};

export function SectionTab({side, fill, className, children, variant = "default"}: SectionTabProps) {
    const position = side === "top-left" ? "top-0" : "bottom-0";
    const paths = variant === "wide" ? TAB_PATHS_WIDE : TAB_PATHS;

    return (
        <>
            {/* Мобильная версия: высота 65px, скругление 20px */}
            <svg
                viewBox="0 0 375 65"
                preserveAspectRatio="none"
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-x-0 z-5 h-16.25 w-full drop-shadow-sm md:hidden",
                    position,
                    className,
                )}
            >
                <path d={paths[side].mobile} fill={fill}/>
            </svg>

            {/* Десктопная версия: высота 100px, скругление 22px */}
            <svg
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-x-0 z-5 hidden h-25 w-full drop-shadow-sm md:block",
                    position,
                    className,
                )}
            >
                <path d={paths[side].desktop} fill={fill}/>
            </svg>

            {/* Контент выступа (заголовок) */}
            {children && (
                <div
                    className={cn(
                        // z-50 — выше SVG и перекрывающих секцию соседей
                        "pointer-events-none absolute z-50 flex h-16.25 md:h-25",
                        LABEL_LAYOUT[variant][side],
                    )}
                >
                    {children}
                </div>
            )}
        </>
    );
}
