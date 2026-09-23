'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useOrderStore } from '@/store/order.store'
import { PackageCheck, ShoppingBag } from 'lucide-react'

export default function AccountPurchasesPage() {
    const { orders, isLoadingOrders, getUserOrders } = useOrderStore()

    useEffect(() => {
        getUserOrders()
    }, [getUserOrders])

    // Покупки — доставленные заказы
    const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED')

    return (
        <div className="p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-[500px]">
            <div className="mb-6">
                <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">
                    Ваши покупки
                </h2>
                <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                    История всех полученных и доставленных товаров
                </p>
            </div>

            {isLoadingOrders ? (
                <div className="text-gray-400 text-sm py-12 text-center">Загрузка покупок...</div>
            ) : deliveredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full text-gray-400">
                        <PackageCheck className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            У вас пока нет доставленных покупок
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                            Товары из полученных заказов будут сохраняться в этом разделе
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D83C2D] text-white font-medium text-xs sm:text-sm hover:bg-[#c43224] transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Перейти в каталог
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {deliveredOrders.map((order) => (
                        <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="text-sm font-semibold text-white">Заказ № {order.orderCode || order.id}</div>
                            <div className="text-xs text-gray-400 mt-1">
                                {order.items?.map((item) => item.productName).join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
