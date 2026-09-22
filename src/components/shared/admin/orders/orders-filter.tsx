'use client'

import React, {useEffect, useState} from 'react'
import {useAdminOrdersStore} from '@/store/admin-orders.store'
import {AdminOrderStatus} from '@/types/admin-order'
import {STATUS_LABELS} from './status-constants'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {RefreshCw, Search, X} from 'lucide-react'

const STATUS_OPTIONS: { label: string; value: AdminOrderStatus | 'ALL' }[] = [
    { label: 'Все заказы', value: 'ALL' },
    { label: STATUS_LABELS[AdminOrderStatus.PENDING], value: AdminOrderStatus.PENDING },
    { label: STATUS_LABELS[AdminOrderStatus.PAID], value: AdminOrderStatus.PAID },
    { label: STATUS_LABELS[AdminOrderStatus.PROCESSING], value: AdminOrderStatus.PROCESSING },
    { label: STATUS_LABELS[AdminOrderStatus.SHIPPED], value: AdminOrderStatus.SHIPPED },
    { label: STATUS_LABELS[AdminOrderStatus.DELIVERED], value: AdminOrderStatus.DELIVERED },
    { label: STATUS_LABELS[AdminOrderStatus.CANCELLED], value: AdminOrderStatus.CANCELLED },
]

export function OrdersFilterBar() {
    const { isConnected, isLoading, filter, setFilter, fetchOrders } = useAdminOrdersStore()
    const [searchValue, setSearchValue] = useState(filter.search || '')

    // Синхронизируем внутренний ввод при внешнем изменении
    useEffect(() => {
        setSearchValue(filter.search || '')
    }, [filter.search])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFilter({ search: searchValue })
    }

    const handleClearSearch = () => {
        setSearchValue('')
        setFilter({ search: '' })
    }

    const handleSelectStatus = (val: string | null) => {
        if (!val) return
        setFilter({ status: val === 'ALL' ? '' : (val as AdminOrderStatus) })
    }

    const currentSelectValue = filter.status || 'ALL'

    return (
        <div className="flex flex-col gap-4">
            {/* Верхняя строка: Поиск + статус сокета + кнопка обновления */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative flex-1 max-w-lg flex items-center"
                >
                    <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Поиск по номеру заказа, ID, адресу или клиенту..."
                        className="pl-10 pr-10 py-2.5 bg-[#1E1E22] border-gray-700/60 text-white placeholder:text-gray-500 rounded-xl w-full focus-visible:ring-1 focus-visible:ring-[#EC5B4D]"
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </form>

                <div className="flex items-center gap-3 shrink-0">
                    {/* Shadcn Select фильтрации по статусу (виден всегда как альтернатива / на мобильных) */}
                    <div className="sm:hidden w-40">
                        <Select
                            value={currentSelectValue}
                            onValueChange={handleSelectStatus}
                        >
                            <SelectTrigger className="w-full bg-[#1E1E22] border-gray-700 text-white text-xs h-9 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1E1E22] border-gray-700 text-white rounded-xl shadow-xl">
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                        className="text-xs py-1.5 cursor-pointer rounded-lg hover:bg-[#2C2C31]"
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Индикатор WebSocket */}
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                            isConnected
                                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                                : 'bg-rose-950/40 border-rose-800/60 text-rose-400 animate-pulse'
                        }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${
                                isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                        />
                        <span>{isConnected ? 'Live WebSocket' : 'Переподключение...'}</span>
                    </div>

                    {/* Кнопка обновления */}
                    <Button
                        type="button"
                        onClick={() => fetchOrders()}
                        disabled={isLoading}
                        variant="ghost"
                        className="p-2.5 bg-[#46464E] hover:bg-[#56565f] text-white rounded-xl transition-colors cursor-pointer"
                        title="Обновить список"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Вкладки по статусам (на планшетах/десктопе) */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {STATUS_OPTIONS.map((tab) => {
                    const isActive = (filter.status || 'ALL') === tab.value
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() =>
                                setFilter({ status: tab.value === 'ALL' ? '' : tab.value })
                            }
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-[#EC5B4D] text-white shadow-sm'
                                    : 'bg-[#1E1E22] text-gray-400 hover:text-white hover:bg-[#3A3A40]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
