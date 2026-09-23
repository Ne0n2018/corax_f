import React from "react";

export function DeliveryInfo() {
    return (
        <div className="p-7.5 bg-[#2C2C31] rounded-[20px] text-white flex flex-col justify-between h-full space-y-6">
            {/* Доставка по Беларуси */}
            <div className="space-y-3">
                <h2 className="font-russo text-2xl">Доставка по Беларуси</h2>
                <p className="text-sm  leading-relaxed">
                    Мы обеспечиваем быструю, надежную и корректную доставку заказов по всей территории Республики Беларусь.
                </p>

                <div className="space-y-1.5 pt-1">
                    <h3 className="text-base font-semibold text-white">
                        Доставка осуществляется следующими службами:
                    </h3>
                    <ul className="text-sm  space-y-1 pl-1">
                        <li>• Белпочта</li>
                        <li>• Европочта</li>
                        <li>• СДЭК</li>
                    </ul>
                </div>

                <p className="text-sm  leading-relaxed">
                    Срок доставки зависит от выбранной службы, удалённости населённого пункта и загруженности перевозчиков.
                </p>
                <p className="text-sm  leading-relaxed">
                    В среднем доставка занимает от 2 до 5 рабочих дней после отправки заказа.
                </p>
                <p className="text-sm  leading-relaxed">
                    После передачи посылки в службу доставки вы обязательно получите трек-номер для отслеживания вашего заказа.
                </p>
            </div>

            {/* Доставка до двери по г. Минск */}
            <div className="space-y-3 pt-2">
                <h2 className="font-russo text-2xl">Доставка до двери по г. Минск</h2>
                <p className="text-sm  leading-relaxed">
                    Доставка осуществляется в согласованное время.
                </p>
                <p className="text-sm  leading-relaxed">
                    Срок доставки составляет до 3 рабочих дней с момента отправки заказа.
                </p>
                <p className="text-sm  leading-relaxed">
                    Доставка выполняется в заранее согласованное с вами время, чтобы вы могли спокойно получить заказ без ожидания.
                </p>
                <p className="text-sm  leading-relaxed">
                    Курьер свяжется с вами перед приездом для подтверждения доставки.
                </p>
                <p className="text-sm  leading-relaxed">
                    Это самый быстрый и комфортный способ получить ваш заказ без посещения пунктов выдачи.
                </p>
            </div>
        </div>
    );
}
