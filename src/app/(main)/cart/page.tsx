'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {Container} from '@/components/ui/container'
import {useCartStore} from '@/store/cart.store'
import {useUserStore} from '@/store/user.store'
import {useOrderStore} from '@/store/order.store'
import {DeliveryType, PaymentType} from '@/types/order'
import {CheckoutItems} from '@/components/shared/checkout/checkout-items'
import {CheckoutDelivery} from '@/components/shared/checkout/checkout-delivery'
import {CheckoutPayment} from '@/components/shared/checkout/checkout-payment'
import {CheckoutPromo} from '@/components/shared/checkout/checkout-promo'
import {CheckoutSummary} from '@/components/shared/checkout/checkout-summary'
import {ArrowLeft, CheckCircle2, ShoppingBag} from 'lucide-react'
import {toast} from 'sonner'

export default function CartCheckoutPage() {
    const { cart, isLoading: isCartLoading, getCart, updateQuantity } = useCartStore()
    const { user, getMe, updateMe } = useUserStore()
    const { createOrder, isSubmitting } = useOrderStore()

    // Состояния выбранных позиций (по умолчанию выбраны все товары из корзины)
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
    const [deliveryType, setDeliveryType] = useState<DeliveryType>(DeliveryType.DELIVERY)
    const [address, setAddress] = useState<string>('')
    const [recipientName, setRecipientName] = useState<string>('')
    const [recipientPhone, setRecipientPhone] = useState<string>('')
    const [saveRecipientToProfile, setSaveRecipientToProfile] = useState<boolean>(true)
    const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.ONLINE)
    const [promoCode, setPromoCode] = useState<string>('')
    const [promoDiscount, setPromoDiscount] = useState<number>(0)
    const [isOrderCompleted, setIsOrderCompleted] = useState<boolean>(false)
    const [completedOrderId, setCompletedOrderId] = useState<string>('')

    // Загрузка корзины и профиля пользователя при монтировании
    useEffect(() => {
        getCart()
        getMe()
    }, [getCart, getMe])

    // Инициализация выбранных элементов
    useEffect(() => {
        if (cart?.CartItem && cart.CartItem.length > 0) {
            setSelectedItemIds((prev) => {
                if (prev.length === 0) {
                    return cart.CartItem.map((item) => item.id)
                }
                const existingIds = cart.CartItem.map((item) => item.id)
                return prev.filter((id) => existingIds.includes(id))
            })
        }
    }, [cart])

    // Инициализация адреса и данных получателя из профиля пользователя
    useEffect(() => {
        if (user) {
            if (user.address && !address) {
                setAddress(user.address)
            }
            if (user.displayName && !recipientName) {
                setRecipientName(user.displayName)
            }
            if (user.number && !recipientPhone) {
                setRecipientPhone(user.number)
            }
        }
    }, [user, address, recipientName, recipientPhone])

    // Для Европочты разрешена только онлайн-оплата картой
    useEffect(() => {
        if (deliveryType === DeliveryType.EUROMAIL && paymentType !== PaymentType.ONLINE) {
            setPaymentType(PaymentType.ONLINE)
        }
    }, [deliveryType, paymentType])

    const items = cart?.CartItem || []
    const selectedItems = items.filter((item) => selectedItemIds.includes(item.id))

    // Сумма за выбранные товары
    const selectedSubtotal = selectedItems.reduce(
        (acc, item) => acc + item.productItem.price * item.quantity,
        0
    )
    const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0)

    // Скидка из промоакций бэкенда (пропорционально выбранным товарам)
    const totalCartAmount = cart?.totalAmount || 0
    const serverDiscount = cart?.discountAmount || 0
    const promotionDiscount = totalCartAmount > 0
        ? Math.round(((serverDiscount * selectedSubtotal) / totalCartAmount) * 100) / 100
        : serverDiscount

    // Общая скидка = промоакции + промокод
    const totalDiscount = Math.min(selectedSubtotal, promotionDiscount + promoDiscount)

    // Стоимость доставки
    const getDeliveryPrice = () => {
        if (selectedItems.length === 0) return 0
        switch (deliveryType) {
            case DeliveryType.PICKUP:
                return 0
            case DeliveryType.EUROMAIL:
                return 5
            case DeliveryType.DELIVERY:
            default:
                return 15
        }
    }
    const deliveryPrice = getDeliveryPrice()

    // Переключение выбора товара
    const handleToggleSelect = (id: string) => {
        setSelectedItemIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        )
    }

    // Изменение количества
    const handleUpdateQuantity = async (id: string, quantity: number) => {
        await updateQuantity(id, quantity)
    }

    // Применение промокода
    const handleApplyPromo = (code: string, discount: number) => {
        setPromoCode(code)
        setPromoDiscount(discount)
    }

    // Удаление промокода
    const handleRemovePromo = () => {
        setPromoCode('')
        setPromoDiscount(0)
    }

    // Валидация возможности оформления
    const isAddressRequired = deliveryType !== DeliveryType.PICKUP
    const isEuromail = deliveryType === DeliveryType.EUROMAIL
    const canSubmit =
        selectedItems.length > 0 &&
        (!isAddressRequired || (address && address.trim().length > 3)) &&
        (!isEuromail || (recipientName.trim().length >= 2 && recipientPhone.trim().length >= 7))

    // Оформление заказа
    const handleSubmitOrder = async () => {
        if (!canSubmit) {
            if (isAddressRequired && (!address || address.trim().length < 4)) {
                toast.error('Пожалуйста, укажите адрес доставки')
            } else if (isEuromail && (!recipientName.trim() || recipientName.trim().length < 2)) {
                toast.error('Для Европочты обязательно укажите ФИО получателя')
            } else if (isEuromail && (!recipientPhone.trim() || recipientPhone.trim().length < 7)) {
                toast.error('Для Европочты обязательно укажите номер телефона получателя')
            } else if (selectedItems.length === 0) {
                toast.error('Выберите хотя бы один товар для оформления')
            }
            return
        }

        // Опционально сохраняем ФИО и телефон в профиле, если включен чекбокс и данные изменились
        if (isEuromail && saveRecipientToProfile && user) {
            const needUpdateName = recipientName.trim() !== (user.displayName || '')
            const needUpdatePhone = recipientPhone.trim() !== (user.number || '')
            if (needUpdateName || needUpdatePhone) {
                updateMe(
                    recipientName.trim(),
                    recipientPhone.trim(),
                    user.birthday || undefined
                ).catch((err) => console.error('Не удалось обновить профиль:', err))
            }
        }

        const effectiveAddress =
            deliveryType === DeliveryType.PICKUP
                ? 'г. Минск, ул. Братская 14, Спортивный зал Адреналин'
                : deliveryType === DeliveryType.EUROMAIL
                ? `${address.trim()} (Получатель: ${recipientName.trim()}, тел: ${recipientPhone.trim()})`
                : address.trim()

        const finalPaymentType =
            deliveryType === DeliveryType.EUROMAIL ? PaymentType.ONLINE : paymentType

        const result = await createOrder({
            deliveryType,
            address: effectiveAddress,
            paymentType: finalPaymentType,
            promoCode: promoCode || undefined,
            recipientName: isEuromail ? recipientName.trim() : undefined,
            recipientPhone: isEuromail ? recipientPhone.trim() : undefined,
        })

        if (result) {
            if (result.redirectUrl) {
                toast.success('Заказ оформлен! Перенаправление на страницу оплаты...')
                window.location.href = result.redirectUrl
                return
            }

            setIsOrderCompleted(true)
            setCompletedOrderId(result.order?.id || '')
            getCart()
            toast.success('Заказ успешно оформлен!')
        }
    }

    // Успешный экран после заказа
    if (isOrderCompleted) {
        return (
            <Container className="py-12 sm:py-20 text-center bg-white">
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl space-y-5 animate-fadeIn">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Спасибо за заказ!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                        Ваш заказ {completedOrderId ? `№${completedOrderId.slice(0, 8)}` : ''} успешно принят в обработку.
                        Мы свяжемся с вами для подтверждения доставки.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/catalog"
                            className="px-6 py-3.5 bg-[#D83C2D] hover:bg-[#c23325] text-white rounded-2xl font-bold text-sm transition-all shadow-md text-center"
                        >
                            Продолжить покупки
                        </Link>
                        <Link
                            href="/account"
                            className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-sm transition-all text-center"
                        >
                            В личный кабинет
                        </Link>
                    </div>
                </div>
            </Container>
        )
    }

    // Экран пустой корзины
    if (!isCartLoading && items.length === 0) {
        return (
            <Container className="py-12 sm:py-20 max-w-md bg-white text-center">
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-5">
                    <div className="w-16 h-16 bg-red-50 text-[#D83C2D] rounded-full flex items-center justify-center mx-auto shadow-2xs">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Ваша корзина пуста
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Добавьте товары из каталога спортивного питания и экипировки, чтобы оформить заказ.
                    </p>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-[#D83C2D] hover:bg-[#c23325] text-white rounded-2xl font-bold text-sm transition-all shadow-md"
                    >
                        Перейти в каталог
                    </Link>
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-7.5 px-5  bg-white rounded-[13px] my-3.75">
            {/* Навигационная крошка назад в каталог */}
            <div className="mb-6">
                <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Вернуться к покупкам</span>
                </Link>
            </div>

            {/* Двухколоночный макет: Слева Выбранные товары, Справа Условия заказа */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Левая колонка: Список товаров */}
                <div className="lg:col-span-7">
                    <CheckoutItems
                        items={items}
                        selectedItemIds={selectedItemIds}
                        onToggleSelect={handleToggleSelect}
                        onUpdateQuantity={handleUpdateQuantity}
                    />
                </div>

                {/* Правая колонка: Условия оформления заказа */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                        {/* 1. Выбор типа доставки и адрес с DaData */}
                        <CheckoutDelivery
                            deliveryType={deliveryType}
                            onSelectDeliveryType={setDeliveryType}
                            address={address}
                            onAddressChange={setAddress}
                            savedUserAddress={user?.address}
                            recipientName={recipientName}
                            onRecipientNameChange={setRecipientName}
                            recipientPhone={recipientPhone}
                            onRecipientPhoneChange={setRecipientPhone}
                            saveRecipientToProfile={saveRecipientToProfile}
                            onSaveRecipientToProfileChange={setSaveRecipientToProfile}
                            isUserAuth={Boolean(user)}
                        />

                        {/* 2. Способ оплаты (без хранения данных карты) */}
                        <CheckoutPayment
                            paymentType={paymentType}
                            onSelectPaymentType={setPaymentType}
                            deliveryType={deliveryType}
                        />

                        {/* 3. Промокод */}
                        <CheckoutPromo
                            subtotal={selectedSubtotal}
                            appliedCode={promoCode}
                            promoDiscount={promoDiscount}
                            onApplyPromo={handleApplyPromo}
                            onRemovePromo={handleRemovePromo}
                        />

                        {/* 4. Итоговая сводка и кнопка оформления */}
                        <CheckoutSummary
                            subtotal={selectedSubtotal}
                            discount={totalDiscount}
                            deliveryPrice={deliveryPrice}
                            totalQuantity={totalQuantity}
                            isSubmitting={isSubmitting}
                            canSubmit={canSubmit}
                            onSubmit={handleSubmitOrder}
                        />
                    </div>
                </div>
            </div>
        </Container>
    )
}