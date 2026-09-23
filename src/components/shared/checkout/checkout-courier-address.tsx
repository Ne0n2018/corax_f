'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/user.store'
import { ArrowLeft, Loader2, MapPin, Package } from 'lucide-react'

interface DadataSuggestion {
    value: string
    unrestricted_value: string
    data: any
}

export interface CheckoutCourierAddressProps {
    address: string
    onAddressChange: (address: string) => void
    savedUserAddress?: string | null
    scope?: 'minsk' | 'belarus'
    title?: string
    addTitle?: string
    addSubtitle?: string
    placeholder?: string
    iconType?: 'pin' | 'package'
    saveToProfile?: boolean
}

export function CheckoutCourierAddress({
    address,
    onAddressChange,
    savedUserAddress,
    scope = 'minsk',
    title,
    addTitle,
    addSubtitle,
    placeholder,
    iconType = 'pin',
    saveToProfile = true,
}: CheckoutCourierAddressProps) {
    const { user, isAuth, updateAddress, isLoading: isUserStoreLoading } = useUserStore()

    // Названия и плейсхолдеры по умолчанию в зависимости от области поиска
    const displayTitle =
        title ||
        (scope === 'belarus'
            ? 'Выберите отделение или адрес Европочты'
            : 'Выберите адрес доставки')

    const displayAddTitle =
        addTitle ||
        (scope === 'belarus' ? 'Добавление адреса' : 'Добавление адреса')

    const displayAddSubtitle =
        addSubtitle ||
        (scope === 'belarus'
            ? 'Добавьте новый адрес доставки'
            : 'Добавьте новый адрес доставки')

    const displayPlaceholder =
        placeholder ||
        (scope === 'belarus' ? 'г. Брест, ул. Ленина...' : 'ул. Пушкина')

    // Текущий актуальный адрес: переданный в заказ или из профиля
    const currentAddress =
        address || (scope === 'minsk' ? savedUserAddress || user?.address || '' : '')

    // Режим добавления/редактирования
    const [isAdding, setIsAdding] = useState(false)
    const [query, setQuery] = useState(currentAddress)
    const [suggestions, setSuggestions] = useState<DadataSuggestion[]>([])
    const [isLoadingDadata, setIsLoadingDadata] = useState(false)

    // Если адрес изменился снаружи, обновляем поисковую строку
    useEffect(() => {
        if (currentAddress && !isAdding) {
            setQuery(currentAddress)
        }
    }, [currentAddress, isAdding])

    // Запрос к DaData с ограничением по городу Минск или по всей Беларуси
    const fetchAddresses = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSuggestions([])
            return
        }

        setIsLoadingDadata(true)
        try {
            const apiKey = process.env.NEXT_PUBLIC_DADATA_API_KEY
            const locations =
                scope === 'minsk'
                    ? [
                          {
                              country_iso_code: 'BY',
                              city: 'Минск',
                          },
                      ]
                    : [
                          {
                              country_iso_code: 'BY',
                          },
                      ]

            const requestBody: Record<string, any> = {
                query: searchQuery,
                count: 7,
                locations,
            }

            if (scope === 'minsk') {
                requestBody.restrict_value = true
            }

            const response = await fetch(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Token ${apiKey}`,
                    },
                    body: JSON.stringify(requestBody),
                }
            )

            const data = await response.json()
            setSuggestions(data.suggestions || [])
        } catch (error) {
            console.error(`Ошибка при запросе к DaData (${scope}):`, error)
        } finally {
            setIsLoadingDadata(false)
        }
    }

    // Дебаунс автопоиска при вводе
    useEffect(() => {
        if (!isAdding) return
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        const timer = setTimeout(() => {
            fetchAddresses(query)
        }, 350)

        return () => clearTimeout(timer)
    }, [query, isAdding, scope])

    const handleSelectSuggestion = (suggestion: DadataSuggestion) => {
        setQuery(suggestion.value)
        setSuggestions([])
    }

    const handleSave = async () => {
        const trimmed = query.trim()
        if (!trimmed) return

        // Если включено сохранение в профиль и пользователь авторизован
        if (saveToProfile && isAuth) {
            await updateAddress(trimmed)
        }

        onAddressChange(trimmed)
        setSuggestions([])
        setIsAdding(false)
    }

    const handleCancel = () => {
        setQuery(currentAddress)
        setSuggestions([])
        setIsAdding(false)
    }

    const isPending = isUserStoreLoading || isLoadingDadata
    const showActionButtons = query.trim().length > 0

    // Иконка
    const renderIcon = () => {
        if (iconType === 'package') {
            return <Package className="w-4 h-4 text-[#D83C2D] shrink-0" />
        }
        return <MapPin className="w-4 h-4 text-[#D83C2D] shrink-0" />
    }

    // ==================== РЕЖИМ 2: ДОБАВЛЕНИЕ / РЕДАКТИРОВАНИЕ АДРЕСА ====================
    if (isAdding) {
        return (
            <div className="space-y-4">
                {/* Шапка: Заголовок и круглая кнопка Назад */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-russo text-xl sm:text-2xl text-gray-900 leading-tight">
                            {displayAddTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            {displayAddSubtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-gray-400 transition-colors shrink-0 cursor-pointer shadow-2xs"
                        aria-label="Назад"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* Поле ввода со встроенной кнопкой "Поиск" */}
                <div className="flex items-center justify-between border border-gray-200 bg-white rounded-2xl p-1.5 pl-4 focus-within:border-gray-400 transition-colors shadow-2xs">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                fetchAddresses(query)
                            }
                        }}
                        placeholder={displayPlaceholder}
                        className="flex-1 bg-transparent text-gray-900 text-xs sm:text-sm outline-none placeholder:text-gray-400 min-w-0"
                    />

                    <Button
                        type="button"
                        onClick={() => fetchAddresses(query)}
                        disabled={isPending}
                        className="bg-[#D83C2D] hover:bg-[#b83325] text-white px-6 sm:px-8 py-2 h-auto rounded-[12px] text-xs sm:text-sm font-normal cursor-pointer transition-colors shrink-0"
                    >
                        {isLoadingDadata ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Поиск'
                        )}
                    </Button>
                </div>

                {/* Список карточек-подсказок DaData */}
                {suggestions.length > 0 && (
                    <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-0.5">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectSuggestion(suggestion)}
                                className="p-3.5 sm:p-4 border border-gray-200 bg-white rounded-2xl text-gray-800 text-xs sm:text-sm cursor-pointer hover:border-[#D83C2D] hover:bg-red-50/10 transition-all shadow-2xs"
                            >
                                {suggestion.value}
                            </div>
                        ))}
                    </div>
                )}

                {/* Кнопки "Сохранить" и "Отмена" */}
                {showActionButtons && (
                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isPending}
                            className="py-2.5 px-8 rounded-[14px] text-xs sm:text-sm bg-[#D83C2D] hover:bg-[#b83325] text-white font-medium cursor-pointer shadow-xs disabled:opacity-50"
                        >
                            {isUserStoreLoading ? 'Сохранение...' : 'Сохранить'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="py-2.5 px-8 rounded-[14px] bg-white border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer transition-colors shadow-2xs"
                        >
                            Отмена
                        </Button>
                    </div>
                )}
            </div>
        )
    }

    // ==================== РЕЖИМ 1: ВЫБОР АДРЕСА (КАК В ЛИЧНОМ КАБИНЕТЕ) ====================
    return (
        <div className="p-4 sm:p-5 bg-gray-50/70 border border-gray-200 rounded-[20px] w-full space-y-3.5 shadow-2xs">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                {displayTitle}
            </h4>

            {currentAddress ? (
                <div className="flex flex-col gap-3">
                    <div className="bg-white border border-gray-200 rounded-[14px] py-3.5 px-4 text-xs sm:text-sm text-gray-900 font-medium flex items-center gap-2.5 shadow-2xs min-w-0">
                        {renderIcon()}
                        <span className="truncate">{currentAddress}</span>
                    </div>

                    <Button
                        type="button"
                        onClick={() => {
                            setQuery(currentAddress)
                            setIsAdding(true)
                        }}
                        className="w-full text-xs sm:text-sm bg-gray-200/80 hover:bg-gray-200 text-gray-800 rounded-[13px] py-3 h-auto font-medium transition-colors cursor-pointer shadow-2xs border-0"
                    >
                        Изменить адрес
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    onClick={() => {
                        setQuery('')
                        setIsAdding(true)
                    }}
                    className="w-full text-xs sm:text-sm bg-[#D83C2D] hover:bg-[#b83325] text-white rounded-[13px] py-3 h-auto font-semibold transition-colors cursor-pointer shadow-xs"
                >
                    Добавить адрес
                </Button>
            )}
        </div>
    )
}
