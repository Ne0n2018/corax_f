'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, MapPin, X } from 'lucide-react'

interface DadataSuggestion {
    value: string
    unrestricted_value: string
    data: any
}

interface CheckoutAddressDadataProps {
    value: string
    onChange: (address: string) => void
    placeholder?: string
}

export function CheckoutAddressDadata({
    value,
    onChange,
    placeholder = 'Начните вводить город, улицу, дом...',
}: CheckoutAddressDadataProps) {
    const [query, setQuery] = useState(value || '')
    const [suggestions, setSuggestions] = useState<DadataSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Синхронизируем query с внешним value
    useEffect(() => {
        setQuery(value || '')
    }, [value])

    // Закрытие при клике снаружи
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchSuggestions = async (searchQuery: string) => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setSuggestions([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const apiKey = process.env.NEXT_PUBLIC_DADATA_API_KEY
            const response = await fetch(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Token ${apiKey}`,
                    },
                    body: JSON.stringify({
                        query: searchQuery,
                        count: 6,
                        locations: [
                            {
                                country_iso_code: 'BY',
                            },
                        ],
                    }),
                }
            )

            const data = await response.json()
            setSuggestions(data.suggestions || [])
            setIsOpen(true)
        } catch (error) {
            console.error('Ошибка DaData (Беларусь):', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Дебаунс запросов к DaData
    useEffect(() => {
        if (!query || query === value) {
            setSuggestions([])
            return
        }

        const timer = setTimeout(() => {
            fetchSuggestions(query)
        }, 350)

        return () => clearTimeout(timer)
    }, [query, value])

    const handleSelect = (item: DadataSuggestion) => {
        setQuery(item.value)
        onChange(item.value)
        setSuggestions([])
        setIsOpen(false)
    }

    const handleClear = () => {
        setQuery('')
        onChange('')
        setSuggestions([])
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        onChange(e.target.value)
                    }}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true)
                    }}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D83C2D] focus:ring-1 focus:ring-[#D83C2D] transition-all shadow-2xs"
                />

                <div className="absolute right-3 flex items-center gap-1">
                    {isLoading && (
                        <Loader2 className="w-4 h-4 text-[#D83C2D] animate-spin" />
                    )}
                    {query && !isLoading && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Выпадающий список подсказок DaData (Беларусь) */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-gray-50 max-h-60 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-start gap-2 text-xs sm:text-sm text-gray-800 cursor-pointer"
                        >
                            <MapPin className="w-3.5 h-3.5 text-[#D83C2D] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{item.value}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
