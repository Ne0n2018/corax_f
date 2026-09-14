'use client'

import React, {useEffect, useRef, useState} from "react";
import {useCategoryStore} from "@/store/category.store";

interface CategorySelectProps {
    value?: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
    error?: string;
}

export function CategorySelect({ value = [], onChange, disabled = false, error }: CategorySelectProps) {
    const { category, getForSelect } = useCategoryStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getForSelect();
    }, [getForSelect]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCategory = (categoryId: string) => {
        const updated = value.includes(categoryId)
            ? value.filter((id) => id !== categoryId)
            : [...value, categoryId];

        onChange(updated);
    };

    // Находим имена выбранных категорий для отображения в кнопке
    const selectedCategoryNames = category
        ?.filter((cat) => value.includes(cat.id))
        .map((cat) => cat.name) || [];

    return (
        <div className="flex flex-col gap-2 relative w-full" ref={dropdownRef}>
            <label className="text-xs text-gray-300 font-medium">Выберите категории</label>

            {/* Триггер-кнопка с активным состоянием при открытии */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between bg-[#242428] hover:bg-[#2C2C31] text-sm text-gray-300 px-4 py-3 rounded-[12px] transition-all cursor-pointer border ${
                    isOpen
                        ? "border-gray-500 bg-[#2C2C31] ring-2 ring-gray-600/30"
                        : "border-transparent hover:border-gray-700"
                } disabled:opacity-50`}
            >
                <div className="flex flex-wrap items-center gap-1.5 overflow-hidden py-0.5">
                    {selectedCategoryNames.length > 0 ? (
                        selectedCategoryNames.length <= 2 ? (
                            selectedCategoryNames.map((name, i) => (
                                <span
                                    key={i}
                                    className="bg-[#323238] border border-gray-600 text-white text-xs px-2.5 py-1 rounded-md font-medium"
                                >
                                    {name}
                                </span>
                            ))
                        ) : (
                            <span className="bg-[#EC5B4D]/20 text-[#EC5B4D] border border-[#EC5B4D]/40 text-xs px-2.5 py-1 rounded-md font-medium">
                                Выбрано категорий: {selectedCategoryNames.length}
                            </span>
                        )
                    ) : (
                        <span className="text-gray-400">Выберите категории...</span>
                    )}
                </div>

                <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ml-2 ${
                        isOpen ? "rotate-180 text-white" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Выпадающий список с высокой контрастностью и тенью */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E22] border border-gray-600 rounded-[12px] p-2 max-h-60 overflow-y-auto z-50 flex flex-col gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] custom-scrollbar">
                    {category && category.length > 0 ? (
                        category.map((cat) => {
                            const isSelected = value.includes(cat.id);
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                                        isSelected
                                            ? "bg-[#2C2C31] text-white font-medium"
                                            : "text-gray-300 hover:bg-[#2C2C31]/70 hover:text-white"
                                    }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                            isSelected
                                                ? "bg-[#EC5B4D] border-[#EC5B4D]"
                                                : "border-gray-500 bg-transparent"
                                        }`}
                                    >
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="select-none truncate">{cat.name}</span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-xs text-gray-400 p-3 text-center">Категории не найдены</div>
                    )}
                </div>
            )}

            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    );
}