import React from "react";

export function PaymentInfo() {
    return (
        <div className="p-7.5 bg-[#2C2C31] rounded-[20px] text-white flex flex-col justify-between h-full space-y-6">
            {/* Оплата */}
            <div className="space-y-3">
                <h2 className="font-russo text-2xl">Оплата</h2>
                <p className="text-sm  leading-relaxed">
                    Мы предлагаем удобные и безопасные способы оплаты:
                </p>
                <ul className="text-sm  space-y-1 pl-1">
                    <li>• Наложенный платёж при получении</li>
                    <li>• Онлайн-оплата банковской картой</li>
                    <li>• Оплата картой при оформлении заказа</li>
                </ul>
                <p className="text-sm  leading-relaxed">
                    Все платёжные операции проходят через защищённые сервисы.
                </p>
            </div>

            {/* Возврат и гарантии */}
            <div className="space-y-4">
                <h2 className="font-russo text-2xl">Возврат и гарантии</h2>
                <p className="text-sm  leading-relaxed">
                    Мы соблюдаем требования законодательства Республики Беларусь и внимательно относимся к качеству поставляемой продукции.
                </p>

                {/* Гарантии */}
                <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-white">Гарантии</h3>
                    <ul className="text-sm  space-y-1 pl-1">
                        <li>• Только оригинальная продукция от официальных поставщиков</li>
                        <li>• Контроль сроков годности</li>
                        <li>• Соблюдение условий хранения</li>
                        <li>• Проверка целостности перед отправкой</li>
                    </ul>
                    <p className="text-sm  leading-relaxed pt-1">
                        Каждый заказ проходит финальную проверку перед передачей в службу доставки.
                    </p>
                </div>

                {/* Возврат */}
                <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-white">Возврат</h3>
                    <p className="text-sm  leading-relaxed">
                        Согласно законодательству Республики Беларусь, товары надлежащего качества, относящиеся к категориям пищевой продукции и БАДов, обмену и возврату не подлежат.
                    </p>
                    <p className="text-sm  leading-relaxed">
                        В случае получения товара с производственным дефектом или повреждением при транспортировке, необходимо связаться с нами в течение 24 часов с момента получения заказа.
                    </p>
                    <p className="text-sm  leading-relaxed">
                        Мы рассматриваем каждое обращение индивидуально и оперативно.
                    </p>
                </div>
            </div>
        </div>
    );
}
