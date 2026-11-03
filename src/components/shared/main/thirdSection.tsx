import Image from "next/image";
import {SectionTab} from "@/components/shared/main/sectionTab";
import { cn } from "@/lib/utils";


interface Props {
    className?: string;
}

export function ThirdSection({className}: Props) {
    return (
        // Внешний блок: зазор между телами 2→3 = 10px (одинаковый на десктопе и мобилке)
        <section className={cn("relative w-full mt-2.5 pb-16.25 md:pb-25", className)}>
            {/* Body-блок: белый фон, скругления (правый нижний угол прямой под выступ) и контент */}
            <div
                className="relative w-full pt-6 pb-20 px-4 md:px-14 flex flex-col justify-between bg-white rounded-[20px] md:rounded-[22px] shadow-sm"
                style={{borderBottomRightRadius: 0}}
            >
                {/* Карточки преимуществ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-6 z-10 md:order-1 md:mb-4">
                    <div className="flex flex-row md:flex-col items-center justify-between gap-3 md:gap-4 border border-[#E7E7E7] rounded-[20px] p-3.5 md:p-5 bg-white drop-shadow-sm">
                        <div className="flex-1 md:flex-none">
                            <h3 className="text-base md:text-[20px] text-black font-bold mb-0.5">Проверенное качество</h3>
                            <p className="text-xs md:text-sm text-[#000000]/55 leading-snug">
                                Только надежные поставщики и оригинальная продукция
                            </p>
                        </div>
                        <Image
                            src="/firstImage.png"
                            alt="Проверенное качество"
                            width={190}
                            height={190}
                            className="w-20 h-20 md:w-47.5 md:h-47.5 object-contain shrink-0"
                        />
                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-between gap-3 md:gap-4 border border-[#E7E7E7] rounded-[20px] p-3.5 md:p-5 bg-white drop-shadow-sm">
                        <div className="flex-1 md:flex-none">
                            <h3 className="text-base md:text-[20px] text-black font-bold mb-0.5">Доставка по Минску</h3>
                            <p className="text-xs md:text-sm text-[#000000]/55 leading-snug">
                                Оперативно доставляем заказы в любой район города
                            </p>
                        </div>
                        <Image
                            src="/secondImage.png"
                            alt="Доставка по Минску"
                            width={190}
                            height={190}
                            className="w-20 h-20 md:w-47.5 md:h-47.5 object-contain shrink-0"
                        />
                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-between gap-3 md:gap-4 border border-[#E7E7E7] rounded-[20px] p-3.5 md:p-5 bg-white drop-shadow-sm">
                        <div className="flex-1 md:flex-none">
                            <h3 className="text-base md:text-[20px] text-black font-bold mb-0.5">Регулярные акции</h3>
                            <p className="text-xs md:text-sm text-[#000000]/55 leading-snug">
                                Скидки, специальные предложения и выгодные бонусы для клиентов
                            </p>
                        </div>
                        <Image
                            src="/thirdImage.png"
                            alt="Регулярные акции"
                            width={190}
                            height={190}
                            className="w-20 h-20 md:w-47.5 md:h-47.5 object-contain shrink-0"
                        />
                    </div>
                </div>
            </div>

            {/* Выступ снизу справа: шов сдвинут вправо (вариант wide) */}
            <SectionTab side="bottom-right" fill="white" variant="wide">
                <h2 className="font-russo text-sm md:text-2xl text-black leading-tight">Наши преимущества</h2>
            </SectionTab>
        </section>
    );
}