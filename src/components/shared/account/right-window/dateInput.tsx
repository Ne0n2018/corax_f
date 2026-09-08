"use client"

import React, {useState} from "react"
import {Control, Controller, FieldErrors} from "react-hook-form"
import {format, isValid, parse} from "date-fns"
import {ru} from "date-fns/locale"
import {CalendarIcon} from "lucide-react"
import {z} from "zod"

import {EditSchema} from "@/schemas/edit.schema"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Input} from "@/components/ui/input"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

type EditSchemaValue = z.infer<typeof EditSchema>

interface DateOfBirthFieldProps {
    control: Control<EditSchemaValue>;
    errors: FieldErrors<EditSchemaValue>;
    disabled: boolean;
}

export function DateOfBirthField({ control, errors, disabled }: DateOfBirthFieldProps) {
    // Состояние открытия поповера
    const [open, setOpen] = useState(false);

    return (
        <Controller
            control={control}
            name="birthDate"
            render={({ field }) => {
                let selectedDate: Date | undefined = undefined;
                if (field.value) {
                    const parsed = parse(field.value, "dd.MM.yyyy", new Date());
                    if (isValid(parsed)) {
                        selectedDate = parsed;
                    }
                }

                return (
                    <div className="flex flex-col gap-2 border rounded-[20px] py-3 border-[#50505E]">

                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="ДД.ММ.ГГГГ"
                                {...field}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d.]/g, '');
                                    field.onChange(value);
                                }}
                                className="bg-[#2A2A32] border-[#3A3A40] text-white"
                                disabled={disabled}
                            />

                            {/* Управление открытием через open и onOpenChange */}
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0 bg-[#2A2A32] border-[#3A3A40] text-gray-400 hover:text-white hover:bg-[#3A3A40]"
                                        disabled={disabled}
                                    >
                                        <CalendarIcon className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0 bg-white" align="end">
                                    <Calendar
                                        mode="single"
                                        locale={ru}
                                        selected={selectedDate}
                                        className={'text-black'}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            if (date) {
                                                field.onChange(format(date, "dd.MM.yyyy"));
                                                setOpen(false); // Закрываем поповер после выбора
                                            }
                                        }}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {errors.birthDate && (
                            <span className="text-red-500 text-sm mt-1">
                {errors.birthDate.message as string}
              </span>
                        )}
                    </div>
                );
            }}
        />
    )
}