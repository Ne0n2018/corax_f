'use client'

import React, {useEffect, useState} from "react";
import {Calendar as CalendarIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";

interface DateTimePickerProps {
    value?: string; // Формат: ГГГГ.ММ.ДД.ЧЧ.ММ
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    defaultTime?: string; // Например "00:00" или "23:59"
}

export function DateTimePicker({
                                   value = "",
                                   onChange,
                                   placeholder = "Выберите дату и время",
                                   disabled = false,
                                   error,
                                   defaultTime = "00:00"
                               }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [time, setTime] = useState<string>(defaultTime);
    const [isOpen, setIsOpen] = useState(false);

    // Парсим имеющуюся строку ГГГГ.ММ.ДД.ЧЧ.ММ в Date и время
    useEffect(() => {
        if (value && value.includes(".")) {
            const parts = value.split(".");
            if (parts.length >= 5) {
                const [y, m, d, hh, mm] = parts.map(Number);
                setSelectedDate(new Date(y, m - 1, d));
                setTime(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
            }
        } else {
            setSelectedDate(undefined);
            setTime(defaultTime);
        }
    }, [value, defaultTime]);

    // Обновляем значение формы при изменении даты или времени
    const updateDateTime = (newDate?: Date, newTime: string = time) => {
        if (!newDate) return;

        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, "0");
        const day = String(newDate.getDate()).padStart(2, "0");
        const [hh, mm] = newTime.split(":").map((v) => String(v || "00").padStart(2, "0"));

        const formatted = `${year}.${month}.${day}.${hh}.${mm}`;
        onChange(formatted);
    };

    const handleSelectDate = (date?: Date) => {
        setSelectedDate(date);
        if (date) {
            updateDateTime(date, time);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime);
        if (selectedDate) {
            updateDateTime(selectedDate, newTime);
        }
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger >
                    <button
                        type="button"
                        disabled={disabled}
                        className={`w-full flex items-center justify-between bg-[#242428] hover:bg-[#2C2C31] text-sm px-4 py-3.5 rounded-[12px] transition-all cursor-pointer border ${
                            isOpen ? "border-gray-500 bg-[#2C2C31]" : "border-transparent"
                        } disabled:opacity-50 text-left`}
                    >
                        <span className={value ? "text-white font-mono" : "text-gray-500"}>
                            {value || placeholder}
                        </span>
                        <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-auto p-3 bg-[#1E1E22] border border-gray-700 text-white rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50"
                >
                    {/* Shadcn Calendar */}
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelectDate}
                        className="bg-transparent"
                    />

                    {/* Выбор времени */}
                    <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-3">
                        <span className="text-xs text-gray-400">Время (ЧЧ:ММ):</span>
                        <input
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            className="bg-[#242428] border border-gray-700 text-white text-xs px-2.5 py-1.5 rounded-[8px] outline-none focus:border-gray-500 font-mono"
                        />
                    </div>
                </PopoverContent>
            </Popover>

            {error && <span className="text-red-500 text-xs mt-0.5">{error}</span>}
        </div>
    );
}