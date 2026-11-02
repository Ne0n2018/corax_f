import {cn} from "@/lib/utils";

type SectionTabSide = "top-left" | "bottom-right";

interface SectionTabProps {
    /** Где расположен выступ относительно основной части секции. */
    side: SectionTabSide;
    /** Цвет заливки — должен совпадать с bg-color основной части секции. */
    fill: string;
    className?: string;
}

// Геометрия выступа одинаковая для всех секций.
// Кривая — это общий шов: у верхнего выступа заливка слева от кривой,
// у нижнего — справа. Поэтому выступы соседних секций повторяют одну и ту же
// кривую, а между секциями остаётся отступ в 10px.
const TAB_PATHS: Record<SectionTabSide, { mobile: string; desktop: string }> = {
    "top-left": {
        mobile: "M 0,65 L 0,20 Q 0,0 20,0 L 160,0 C 195,0 220,65 250,65 Z",
        desktop: "M 0,100 L 0,22 Q 0,0 22,0 L 310,0 C 360,0 390,100 440,100 Z",
    },
    "bottom-right": {
        mobile: "M 160,0 C 195,0 220,65 250,65 L 355,65 Q 375,65 375,45 L 375,0 Z",
        desktop: "M 310,0 C 360,0 390,100 440,100 L 1178,100 Q 1200,100 1200,78 L 1200,0 Z",
    },
};

export function SectionTab({side, fill, className}: SectionTabProps) {
    const position = side === "top-left" ? "top-0" : "bottom-0";

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
                <path d={TAB_PATHS[side].mobile} fill={fill}/>
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
                <path d={TAB_PATHS[side].desktop} fill={fill}/>
            </svg>
        </>
    );
}
