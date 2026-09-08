'use client'

import React, {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {ChevronDown, Search, X} from "lucide-react";

interface Option {
    id: string;
    name: string;
}

interface SelectWithSearchProps {
    options: Option[] | undefined;
    value?: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: string;
    isLoading?: boolean;
}

export const SelectWithSearch = ({
                                     options,
                                     value,
                                     onChange,
                                     placeholder,
                                     error,
                                     isLoading = false,
                                 }: SelectWithSearchProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Находим выбранный элемент для отображения
    const selectedOption = options?.find((opt) => opt.id === value);

    // Фильтрация вариантов по поисковому запросу
    const filteredOptions = options?.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    // Закрытие выпадающего списка при клике вне его
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Кнопка открытия списка */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[14px] px-4 py-3 text-sm flex items-center justify-between transition-colors h-11"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Выпадающий блок с поиском и списком */}
            {isOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#35353C] border border-[#50505E] rounded-[14px] p-2 z-50 shadow-xl flex flex-col gap-2 max-h-60">
                    {/* Инпут поиска */}
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 absolute left-3 text-white/50" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Поиск..."
                            autoFocus
                            className="bg-[#2A2A2A] border-none text-white text-xs pl-9 pr-8 py-2 rounded-[10px] h-8 focus-visible:ring-1 focus-visible:ring-red-500"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-2 text-white/50 hover:text-white"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Список опций */}
                    <div className="overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="text-white/50 text-xs p-2 text-center">Загрузка...</div>
                                
                        ) : filteredOptions?.length > 0 ? (
                            filteredOptions?.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.id);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors truncate ${
                                        value === opt.id
                                            ? "bg-red-500 text-white font-medium"
                                            : "text-white/90 hover:bg-[#46464E]"
                                    }`}
                                >
                                    {opt.name}
                                </button>
                            ))
                        ) : (
                            <div className="text-white/40 text-xs p-2 text-center">Ничего не найдено</div>
                        )}
                    </div>
                </div>
            )}

            {error && <span className="text-red-500 text-xs ml-2 mt-1 block">{error}</span>}
        </div>
    );
};