import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Plus, Trash2} from "lucide-react";

interface DynamicFieldArrayProps {
    title: string;
    fieldName: "characteristic" | "size" | "taste";
    valKey: "value" | "price";
    placeholder1: string;
    placeholder2: string;
    isNumber?: boolean;
    register: any;
    errors: any;
    fieldArray: any;
}

export const DynamicFieldArray = React.memo(({
                                                 title,
                                                 fieldName,
                                                 valKey,
                                                 placeholder1,
                                                 placeholder2,
                                                 isNumber = false,
                                                 register,
                                                 errors,
                                                 fieldArray
                                             }: DynamicFieldArrayProps) => {
    const { fields, append, remove } = fieldArray;
    const arrayErrors = errors[fieldName] as any;

    if (fields.length === 0) {
        return (
            <Button
                type="button"
                onClick={() => append({ name: "", [valKey]: isNumber ? 0 : "" })}
                className="bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[14px] px-6 py-5 w-fit font-normal"
            >
                {title}
            </Button>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <label className="text-white/55 text-sm ml-2 block mb-1">
                {title.replace("Добавить ", "Список: ")}
            </label>
            {fields.map((field: any, idx: number) => {
                const itemErrors = arrayErrors?.[idx];

                return (
                    <div key={field.id} className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1">
                                <Input
                                    placeholder={placeholder1}
                                    {...register(`${fieldName}.${idx}.name` as const)}
                                    className="bg-[#2A2A2A] border-none text-white rounded-[14px] px-4 py-6 focus-visible:ring-1 focus-visible:ring-red-500 w-full"
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    type={isNumber ? "number" : "text"}
                                    placeholder={placeholder2}
                                    {...register(`${fieldName}.${idx}.${valKey}` as const, { valueAsNumber: isNumber })}
                                    className="bg-[#2A2A2A] border-none text-white rounded-[14px] px-4 py-6 focus-visible:ring-1 focus-visible:ring-red-500 w-full"
                                />
                            </div>

                            {/* Кнопки плюс/удалить */}
                            {fields.length === 1 && (
                                <button
                                    type="button"
                                    onClick={() => append({ name: "", [valKey]: isNumber ? 0 : "" })}
                                    className="p-3 bg-[#46464E] hover:bg-[#5a5a65] rounded-[14px] transition-colors"
                                >
                                    <Plus className="w-6 h-6 text-white" />
                                </button>
                            )}

                            {fields.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="p-3 bg-[#46464E] hover:bg-red-500/20 text-white hover:text-red-400 rounded-[14px] transition-colors"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>

                                    {idx === fields.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => append({ name: "", [valKey]: isNumber ? 0 : "" })}
                                            className="p-3 bg-[#46464E] hover:bg-[#5a5a65] rounded-[14px] transition-colors"
                                        >
                                            <Plus className="w-6 h-6 text-white" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {(itemErrors?.name || itemErrors?.[valKey]) && (
                            <div className="flex gap-4 ml-2">
                                {itemErrors?.name && (
                                    <span className="text-red-500 text-xs flex-1">{itemErrors.name.message}</span>
                                )}
                                {itemErrors?.[valKey] && (
                                    <span className="text-red-500 text-xs flex-1">{itemErrors[valKey].message}</span>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});
DynamicFieldArray.displayName = "DynamicFieldArray";