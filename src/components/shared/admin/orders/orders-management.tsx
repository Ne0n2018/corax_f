'use client'

import React, {useEffect} from 'react'
import {useAdminOrdersStore} from '@/store/admin-orders.store'
import {OrdersFilterBar} from './orders-filter'
import {OrderCard} from './order-card'
import {OrderDetailsDialog} from './order-details-dialog'
import {Button} from '@/components/ui/button'
import {Inbox, Loader2} from 'lucide-react'

export function OrdersManagement() {
    const {
        connect,
        disconnect,
        orders,
        meta,
        isLoading,
        setFilter,
    } = useAdminOrdersStore()

    // Подключение к WebSocket при монтировании и отключение при размонтировании
    useEffect(() => {
        connect()
        return () => {
            disconnect()
        }
    }, [connect, disconnect])

    const handlePageChange = (newPage: number) => {
        setFilter({ page: newPage })
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Панель фильтров и поиска */}
            <OrdersFilterBar />

            {/* Список заказов */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-8 h-8 text-[#EC5B4D] animate-spin mb-3" />
                    <p className="text-sm">Загрузка заказов по WebSocket...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-500 bg-[#1E1E22] rounded-2xl border border-gray-800">
                    <Inbox className="w-12 h-12 text-gray-600 mb-3 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-white">Заказы не найдены</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Попробуйте изменить параметры поиска или фильтра по статусу
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}

            {/* Пагинация */}
            {meta.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 text-white">
                    <span className="text-xs text-gray-400">
                        Всего заказов: <span className="font-bold text-white">{meta.total}</span>
                    </span>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            disabled={meta.page <= 1}
                            onClick={() => handlePageChange(meta.page - 1)}
                            className="bg-[#2C2C31] hover:bg-[#3A3A40] text-white rounded-xl px-4 py-2 disabled:opacity-40 cursor-pointer text-xs"
                        >
                            Назад
                        </Button>
                        <span className="text-xs font-semibold">
                            {meta.page} из {meta.totalPages}
                        </span>
                        <Button
                            type="button"
                            disabled={meta.page >= meta.totalPages}
                            onClick={() => handlePageChange(meta.page + 1)}
                            className="bg-[#2C2C31] hover:bg-[#3A3A40] text-white rounded-xl px-4 py-2 disabled:opacity-40 cursor-pointer text-xs"
                        >
                            Вперед
                        </Button>
                    </div>
                </div>
            )}

            {/* Модальное окно детальной информации о заказе */}
            <OrderDetailsDialog />
        </div>
    )
}
