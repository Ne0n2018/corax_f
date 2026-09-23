'use client'

import React from 'react'
import {DeliveryType} from '@/types/order'
import {CheckoutCourierAddress} from './checkout-courier-address'
import {Check, MapPin, Package, Phone, Store, Truck, User} from 'lucide-react'

interface CheckoutDeliveryProps {
    deliveryType: DeliveryType
    onSelectDeliveryType: (type: DeliveryType) => void
    address: string
    onAddressChange: (address: string) => void
    savedUserAddress?: string | null
    recipientName?: string
    onRecipientNameChange?: (name: string) => void
    recipientPhone?: string
    onRecipientPhoneChange?: (phone: string) => void
    saveRecipientToProfile?: boolean
    onSaveRecipientToProfileChange?: (save: boolean) => void
    isUserAuth?: boolean
}

export function CheckoutDelivery({
    deliveryType,
    onSelectDeliveryType,
    address,
    onAddressChange,
    savedUserAddress,
    recipientName = '',
    onRecipientNameChange,
    recipientPhone = '',
    onRecipientPhoneChange,
    saveRecipientToProfile = true,
    onSaveRecipientToProfileChange,
    isUserAuth = false,
}: CheckoutDeliveryProps) {

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
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-2xs space-y-4">
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
                    <CheckoutCourierAddress
                        address={address}
                        onAddressChange={onAddressChange}
                        savedUserAddress={savedUserAddress}
                    />
                )}

                {/* Доставка Европочтой */}
                {deliveryType === DeliveryType.EUROMAIL && (
                    <div className="space-y-4">
                        <CheckoutCourierAddress
                            address={address}
                            onAddressChange={onAddressChange}
                            scope="belarus"
                            title="Выберите отделение или адрес Европочты"
                            addTitle="Добавление адреса"
                            addSubtitle="Укажите отделение или адрес Европочты в Беларуси"
                            placeholder="г. Брест, ул. Ленина..."
                            iconType="package"
                            saveToProfile={false}
                        />

                        {/* Данные получателя для Европочты */}
                        <div className="pt-3 border-t border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                    Данные получателя
                                </h4>
                                <span className="text-[11px] font-semibold text-[#D83C2D] bg-[#D83C2D]/10 px-2 py-0.5 rounded-md">
                                    Обязательно для Европочты
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1 pl-1">
                                        ФИО получателя (полностью)
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={recipientName}
                                            onChange={(e) => onRecipientNameChange?.(e.target.value)}
                                            placeholder="Иванов Иван Иванович"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D83C2D] focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1 pl-1">
                                        Номер мобильного телефона
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            value={recipientPhone}
                                            onChange={(e) => onRecipientPhoneChange?.(e.target.value)}
                                            placeholder="+375 (29) 123-45-67"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D83C2D] focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {isUserAuth && onSaveRecipientToProfileChange && (
                                    <label className="flex items-center gap-2 pt-1 pl-1 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={saveRecipientToProfile}
                                            onChange={(e) => onSaveRecipientToProfileChange(e.target.checked)}
                                            className="w-4 h-4 rounded text-[#D83C2D] focus:ring-[#D83C2D] accent-[#D83C2D]"
                                        />
                                        <span className="text-xs text-gray-600">
                                            Сохранить имя и номер в профиле
                                        </span>
                                    </label>
                                )}
                            </div>

                            <p className="text-[11px] text-gray-400 pl-1 leading-relaxed">
                                Европочта отправляет SMS с трек-номером и кодом получения на указанный телефон. Выдача посылки в отделении осуществляется по документу, удостоверяющему личность.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
