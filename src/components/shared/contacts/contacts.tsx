import Link from "next/link";
import Image from "next/image";

const socialLinks = [
    {
        href: "https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D",
        icon: "/instagram.svg",
        alt: "instagram",
    },
    {
        href: "https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D",
        icon: "/telegram.svg",
        alt: "telegram",
    },
    {
        href: "https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D",
        icon: "/tiktok.svg",
        alt: "tiktok",
    },
];

export function Contacts() {
    return (
        <div className="relative overflow-hidden p-5 sm:p-7.5 bg-[#2C2C31] rounded-[20px] flex flex-col sm:flex-row justify-between textmin-h-135 sm:min-h-0">
            {/* Основной текстовый контент */}
            <div className="flex flex-col gap-4 sm:gap-5 z-10">
                <h2 className="font-russo text-2xl">Контакты</h2>

                <div>
                    <h3 className="text-xl font-semibold mb-1 sm:mb-2">Адрес магазина</h3>
                    <p className="font-semibold text-sm  leading-snug">
                        ул. Братская 14 Находится в спортивный зале “Адреналин”
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-1 sm:mb-2">Номер телефона (МТС)</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="font-semibold text-sm ">+375 (00) 000 00 00</p>
                        <p className="font-semibold text-sm ">Эдгар Викторович</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-1 sm:mb-2">Email</h3>
                    <p className="font-semibold text-sm ">info@gmail.com</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-1 sm:mb-2">Режим работы</h3>
                    <p className="font-semibold text-sm ">Понедельник - пятница: 9:00 - 21:00</p>
                    <p className="font-semibold text-sm ">Суббота - воскресенье: 9:00 - 21:00</p>
                </div>

                {/* Юридическая информация с ограничением ширины на мобилке, чтобы не перекрывать викинга */}
                <div className="max-w-[62%] sm:max-w-none">
                    <h3 className="text-xl font-semibold mb-1 sm:mb-2">Юридическая информация</h3>
                    <div className="font-semibold text-sm  space-y-0.5 leading-snug">
                        <p>ИП Креер Эдгар Викторович</p>
                        <p>УНП 791354984</p>
                        <p>Могилевская обл., г. Бобруйск, ул.</p>
                        <p className="break-all sm:break-normal">BY36ALFA30132E83210010270000</p>
                        <p>ЗАО “Альфа-Банк”</p>
                    </div>
                </div>

                {/* Иконки соцсетей для мобильных устройств (горизонтальный ряд под текстом) */}
                <div className="flex sm:hidden flex-row items-center gap-2.5 mt-5 pt-2 z-10 relative">
                    {socialLinks.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl bg-[#46464E] p-3 flex items-center justify-center hover:bg-[#575760] transition-colors"
                        >
                            <Link href={item.href} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={item.icon}
                                    alt={item.alt}
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Иконки соцсетей для десктопа (вертикальный стек справа вверху) */}
            <div className="hidden sm:flex flex-col items-end gap-3.75 relative z-10 shrink-0">
                {socialLinks.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-[20px] bg-[#46464E] p-4.5 hover:bg-[#575760] transition-colors"
                    >
                        <Link href={item.href} target="_blank" rel="noopener noreferrer">
                            <Image
                                src={item.icon}
                                alt={item.alt}
                                width={31}
                                height={31}
                                className="w-7.75 h-7.75"
                            />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Изображение викинга (прижато к правому нижнему углу) */}
            <div className="absolute bottom-0 right-0 pointer-events-none leading-none z-0">
                <Image
                    src="/contact.png"
                    alt="contact"
                    width={267}
                    height={357}
                    priority
                    className="w-36.25 xs:w-[160px] sm:w-55 md:w-66.75 h-auto block select-none"
                />
            </div>
        </div>
    );
}