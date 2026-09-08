'use client'

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {useUserStore} from "@/store/user.store";
import {ArrowLeft} from "lucide-react";


interface DadataSuggestion {
    value: string;
    unrestricted_value: string;
    data: any;
}

interface AddressAutocompleteProps {
    onSelect?: (address: DadataSuggestion) => void;
    onBack: () => void;
}

export function AddressAutocomplete({ onSelect, onBack }: AddressAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<DadataSuggestion[]>([]);
    const [isLoadingDadata, setIsLoading] = useState(false);

    // Достаем функцию обновления адреса и статус загрузки из Zustand стора
    const { updateAddress, isLoading } = useUserStore();

    const fetchAddresses = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`
                },
                body: JSON.stringify({
                    query: searchQuery,
                    count: 6,
                    locations: [
                        {
                            country_iso_code: "BY",
                            region: "Минская"
                        },
                        {
                            country_iso_code: "BY",
                            city: "Минск"
                        }
                    ]
                })
            });

            const data = await response.json();
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error("Ошибка при запросе к DaData:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAddresses(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (suggestion: DadataSuggestion) => {
        setQuery(suggestion.value);
        setSuggestions([]);
        if (onSelect) onSelect(suggestion);
    };

    // Обработчик сохранения адреса
    const handleSave = async () => {
        if (!query.trim()) return;
        await updateAddress(query);
        setSuggestions([]);
    };

    // Обработчик отмены
    const handleCancel = () => {
        setQuery("");
        setSuggestions([]);
    };

    // Кнопки отображаются только когда пользователь начал вводить текст
    const showActionButtons = query.trim().length > 0;
    const isPending = isLoading || isLoadingDadata;

    return (
        <>
            <div>
                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-russo text-2xl">Адрес доставки</h2>
                    <Button
                        type="button"
                        onClick={onBack}
                        className="bg-[#46464E] hover:bg-[#565660] p-5 rounded-[20px] shrink-0 text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-sm text-[#9E9E9E] mb-5">Укажите адрес, и мы доставим заказ прямо к вам</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-2xl">
                {/* Поле ввода с кнопкой поиска */}
                <div className="flex items-center justify-between border border-[#3A3A40] bg-[#2A2A32] rounded-2xl p-1.5 pl-4 focus-within:border-gray-400 transition-colors">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ул. Пушкина"
                        className="flex-1 bg-transparent text-[#E1E1E1] text-sm outline-none placeholder:text-gray-500"
                    />
                    <Button
                        onClick={() => fetchAddresses(query)}
                        disabled={isPending}
                        className="bg-[#46464E] text-white hover:bg-[#52525B] px-8 py-2 h-auto rounded-[12px] text-sm font-normal"
                    >
                        Поиск
                    </Button>
                </div>

                {/* Список подсказок */}
                {suggestions.length > 0 && (
                    <div className="flex flex-col gap-3 mt-1">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(suggestion)}
                                className="p-4 border border-[#3A3A40] bg-[#2A2A32] rounded-2xl text-[#E1E1E1] text-sm cursor-pointer hover:border-gray-400 transition-colors"
                            >
                                {suggestion.value}
                            </div>
                        ))}
                    </div>
                )}

                {/* Блок кнопок Сохранить / Отмена */}
                {showActionButtons && (
                    <div className="flex gap-2 mt-2">
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isPending}
                            className="py-2.75 px-8 rounded-[13px] text-sm bg-[#D83C2D] hover:bg-[#b83325] text-white"
                        >
                            {isLoading ? "Сохранение..." : "Сохранить"}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="py-2.75 px-8 rounded-[13px] bg-[#4C4C55] hover:bg-gray-600 text-sm text-white"
                        >
                            Отмена
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}