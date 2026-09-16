'use client'
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Image from "next/image";

interface FirstSectionProps {
    isAuthenticated: boolean;
}

export function FirstSection({ isAuthenticated }: FirstSectionProps) {
    // Десктопные пути SVG (скос снизу сохранён везде)
    const desktopPathAuthenticated = "M 0,20 Q 0,0 20,0 L 1180,0 Q 1200,0 1200,20 L 1200,380 Q 1200,400 1180,400 L 440,400 C 390,400 360,300 310,300 L 20,300 Q 0,300 0,280 Z";
    const desktopPathUnauthenticated = "M 0,20 Q 0,0 20,0 L 1200,0 L 1200,380 Q 1200,400 1180,400 L 440,400 C 390,400 360,300 310,300 L 20,300 Q 0,300 0,280 Z";

    // Мобильные пути SVG (скос снизу сохранён везде)
    const mobilePathAuthenticated = "M 0,20 Q 0,0 20,0 L 355,0 Q 375,0 375,20 L 375,380 Q 375,400 355,400 L 260,400 C 220,400 200,340 160,340 L 20,340 Q 0,340 0,320 Z";
    const mobilePathUnauthenticated = "M 0,20 Q 0,0 20,0 L 375,0 L 375,380 Q 375,400 355,400 L 260,400 C 220,400 200,340 160,340 L 20,340 Q 0,340 0,320 Z";

    return (
        <div className={cn("relative w-full flex px-6 py-13 md:px-14 md:py-10 md:mt-3.75", !isAuthenticated && "md:mt-0 mt-2.5")}>

            {/* Десктопный SVG Фон */}
            <svg
                viewBox="0 0 1200 400"
                preserveAspectRatio="none"
                className="hidden md:block absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-sm"
            >
                <path
                    d={isAuthenticated ? desktopPathAuthenticated : desktopPathUnauthenticated}
                    fill="white"
                />
            </svg>

            {/* Мобильный SVG Фон */}
            <svg
                viewBox="0 0 375 400"
                preserveAspectRatio="none"
                className="block md:hidden absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-sm"
            >
                <path
                    d={isAuthenticated ? mobilePathAuthenticated : mobilePathUnauthenticated}
                    fill="white"
                />
            </svg>

            {/* Контент слева */}
            <div className="z-10 pb-15 flex flex-col items-center md:items-start md:text-left text-center">
                <h1 className="font-russo text-black text-[30px] md:text-[40px] leading-tight mb-3.75">
                    ТВОЯ СИЛА ТВОЙ ГЛАВНЫЙ РЕСУРС
                </h1>
                <p className="font-mono text-[12px] md:text-sm text-[#737373] mb-6">
                    Интернет-магазин спортивного питания для роста мышц, силы и выносливости.
                </p>
                <Button className="bg-[#D83C2D] hover:bg-[#c23325] text-white rounded-[13px] px-8 py-3.5 transition-colors cursor-pointer">
                    Заказать звонок
                </Button>
            </div>

            {/* Изображение справа */}
            <div className="relative z-10 shrink-0 hidden md:block">
                <Image
                    src="/firstSection.png"
                    alt="firstSection"
                    width={634}
                    height={335}
                    priority
                    className="object-contain"
                />
            </div>
        </div>
    );
}