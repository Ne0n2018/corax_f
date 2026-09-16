import Image from "next/image";

export function ThirdSection() {
    return (
        <section className="relative w-full pt-6 pb-20 px-4 md:px-14 flex flex-col justify-between mt-3.75">
            {/* SVG Фон для мобильных устройств (< md): viewBox увеличен до 400x720 */}
            <svg
                viewBox="0 0 400 720"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-sm md:hidden"
            >
                <path
                    d="
                       M 0,24
                       Q 0,0 24,0
                       L 376,0
                       Q 400,0 400,24
                       L 400,696
                       Q 400,720 376,720
                       L 250,720
                       C 210,720 190,620 150,620
                       L 24,620
                       Q 0,620 0,596
                       Z
                      "
                    fill="white"
                />
            </svg>

            {/* SVG Фон для десктопа (>= md) */}
            <svg
                viewBox="0 0 1200 480"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-sm hidden md:block"
            >
                <path
                    d="
                       M 0,22
                       Q 0,0 22,0
                       L 1178,0
                       Q 1200,0 1200,22
                       L 1200,458
                       Q 1200,480 1178,480
                       L 760,480
                       C 710,480 680,380 630,380
                       L 22,380
                       Q 0,380 0,358
                       Z
                      "
                    fill="white"
                />
            </svg>

            {/* Заголовок */}
            <div className="z-10 mb-4 md:mb-0 md:order-2 flex justify-center md:justify-end md:pr-10 md:pt-2">
                <h2 className="font-russo text-2xl md:text-2xl text-black text-center md:text-right">
                    Наши преимущества
                </h2>
            </div>

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
        </section>
    );
}