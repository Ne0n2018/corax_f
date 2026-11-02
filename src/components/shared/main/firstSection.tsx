'use client'
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {CallbackDialog} from "@/components/shared/callback/callback.dialog";
import {SectionTab} from "@/components/shared/main/sectionTab";

interface FirstSectionProps {
    isAuthenticated: boolean;
}

export function FirstSection({ isAuthenticated }: FirstSectionProps) {
    return (
        // Внешний блок: только позиционирование, отступ сверху и место под выступ снизу
        <div className={cn("relative w-full pb-16.25 md:pb-25 md:mt-3.75", !isAuthenticated && "md:mt-0 mt-2.5")}>

            {/* Body-блок: белый фон, скругления и контент секции */}
            <div
                className="relative w-full flex px-6 py-13 md:px-14 md:py-10 bg-white rounded-[20px] md:rounded-[22px] shadow-sm"
                style={{borderBottomRightRadius: 0}}
            >

                {/* Контент слева */}
                <div className="z-10 pb-15 flex flex-col items-center md:items-start md:text-left text-center">
                    <h1 className="font-russo text-black text-[30px] md:text-[40px] leading-tight mb-3.75">
                        ТВОЯ СИЛА ТВОЙ ГЛАВНЫЙ РЕСУРС
                    </h1>
                    <p className="font-mono text-[12px] md:text-sm text-[#737373] mb-6">
                        Интернет-магазин спортивного питания для роста мышц, силы и выносливости.
                    </p>
                    <CallbackDialog
                        trigger={
                            <Button className="bg-[#D83C2D] hover:bg-[#c23325] text-white rounded-[13px] px-8 py-3.5 transition-colors cursor-pointer">
                                Заказать звонок
                            </Button>
                        }
                    />
                </div>

                {/* Резерв места под картинку: сама картинка вынесена в absolute,
                    чтобы могла выйти за нижнюю границу body и лечь на выступ */}
                <div aria-hidden className="hidden w-158.5 shrink-0 md:block md:h-83.75"/>
            </div>

            {/* Изображение справа: растянуто на всю высоту секции и на выступ снизу.
                Прижато к правому краю, нижний правый угол скруглён как у выступа. */}
            <div className="absolute inset-y-0 right-0 z-10 hidden w-158.5 overflow-hidden rounded-tr-[22px] rounded-br-[22px] md:block">
                <Image
                    src="/firstSection.png"
                    alt="firstSection"
                    fill
                    priority
                    sizes="634px"
                    className="object-cover"
                />
            </div>

            {/* Выступ снизу справа — общий компонент стыка секций */}
            <SectionTab side="bottom-right" fill="white" />
        </div>
    );
}