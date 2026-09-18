'use client'

import React, {useState} from 'react'
import {DeliveryType} from '@/types/order'
import {CheckoutAddressDadata} from './checkout-address-dadata'
import {Check, MapPin, Package, Plus, Store, Truck} from 'lucide-react'

interface CheckoutDeliveryProps {
    deliveryType: DeliveryType
    onSelectDeliveryType: (type: DeliveryType) => void
    address: string
    onAddressChange: (address: string) => void
    savedUserAddress?: string | null
}

export function CheckoutDelivery({
    deliveryType,
    onSelectDeliveryType,
    address,
    onAddressChange,
    savedUserAddress,
}: CheckoutDeliveryProps) {
    const [isEditingAddress, setIsEditingAddress] = useState(!address && !savedUserAddress)

    // Если у пользователя есть сохраненный адрес и поле адреса пустое, инициализируем им
    React.useEffect(() => {
        if (!address && savedUserAddress && deliveryType === DeliveryType.DELIVERY) {
            onAddressChange(savedUserAddress)
        }
    }, [savedUserAddress, deliveryType, address, onAddressChange])

    return (
        <div className="space-y-4">
            {/* Переключатель способа доставки (Самовывоз / Курьером / Европочта) */}
            <div className="bg-white rounded-2xl p-1.5 border border-gray-200 grid grid-cols-3 gap-1 shadow-2xs">
                <button
                    type="button"
                    onClick={() => onSelectDeliveryType(DeliveryType.PICKUP)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === DeliveryType.PICKUP
                            ? 'bg-[#D83C2D] text-white shadow-xs'
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    <Store className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Самовывоз</span>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectDeliveryType(DeliveryType.DELIVERY)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === DeliveryType.DELIVERY
                            ? 'bg-[#D83C2D] text-white shadow-xs'
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Курьером</span>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectDeliveryType(DeliveryType.EUROMAIL)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === DeliveryType.EUROMAIL
                            ? 'bg-[#D83C2D] text-white shadow-xs'
                            : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    <Package className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Европочта</span>
                </button>
            </div>

            {/* Контейнер условий адреса доставки */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-2xs space-y-3">
                {/* Самовывоз */}
                {deliveryType === DeliveryType.PICKUP && (
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-2">
                            Пункт выдачи заказа
                        </h4>
                        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 space-y-1">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-[#D83C2D] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs sm:text-sm font-bold text-gray-800">
                                        г. Минск, ул. Братская 14, Спортивный зал «Адреналин»
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Пн-Пт: 10:00 - 23:00, Сб-Вс: 9:00 - 21:00
                                    </p>
                                </div>
                            </div>
                            <div className="pt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Бесплатный самовывоз
                            </div>
                        </div>
                    </div>
                )}

                {/* Доставка курьером */}
                {deliveryType === DeliveryType.DELIVERY && (
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-2">
                            Выберите адрес доставки
                        </h4>

                        {/* Если адрес уже выбран и мы не в режиме ввода */}
                        {address && !isEditingAddress ? (
                            <div className="space-y-2">
                                <div className="border-2 border-[#D83C2D] bg-[#D83C2D]/5 rounded-2xl p-3.5 flex items-center justify-between gap-2 shadow-2xs">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <MapPin className="w-4 h-4 text-[#D83C2D] shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                            {address}
                                        </span>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-[#D83C2D] flex items-center justify-center shrink-0">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#D83C2D]" />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsEditingAddress(true)}
                                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:text-black hover:border-gray-300 transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Изменить или добавить другой адрес
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <CheckoutAddressDadata
                                    value={address}
                                    onChange={(newAddr) => {
                                        onAddressChange(newAddr)
                                        if (newAddr.length > 5) {
                                            // оставляем возможность сохранить
                                        }
                                    }}
                                    placeholder="Введите адрес в Беларуси (ул., дом, кв.)..."
                                />
                                {address && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingAddress(false)}
                                        className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
                                    >
                                        Готово
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Доставка Европочтой */}
                {deliveryType === DeliveryType.EUROMAIL && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                Отделение или адрес Европочты
                            </h4>
                            <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                Беларусь
                            </span>
                        </div>

                        {address && !isEditingAddress ? (
                            <div className="space-y-2">
                                <div className="border-2 border-[#D83C2D] bg-[#D83C2D]/5 rounded-2xl p-3.5 flex items-center justify-between gap-2 shadow-2xs">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Package className="w-4 h-4 text-[#D83C2D] shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                            {address}
                                        </span>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-[#D83C2D] flex items-center justify-center shrink-0">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#D83C2D]" />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsEditingAddress(true)}
                                    className="w-full py-2 px-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:text-black hover:border-gray-300 transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Изменить отделение
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <CheckoutAddressDadata
                                    value={address}
                                    onChange={(newAddr) => {
                                        onAddressChange(newAddr)
                                    }}
                                    placeholder="Введите город или отделение Европочты в Беларуси..."
                                />
                                {address && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingAddress(false)}
                                        className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
                                    >
                                        Готово
                                    </button>
                                )}
                            </div>
                        )}
                        <p className="text-[11px] text-gray-400 mt-2">
                            Адрес отделения для доставки будет проверен сервисом Европочты перед отправкой.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
