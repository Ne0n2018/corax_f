'use client'

import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {usePromoStore} from "@/store/promo.store";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {CategorySelect} from "@/components/shared/admin/promo/categorySelect";
import {DateTimePicker} from "@/components/shared/admin/promo/dateTimePicker";
import {Button} from "@/components/ui/button";


const formatIsoToPicker = (dateStr?: string | Date) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day}.${hh}.${mm}`;
};

const parsePickerToIso = (str?: string) => {
    if (!str || !str.includes(".")) return undefined;
    const [y, m, d, hh, mm] = str.split(".").map(Number);
    return new Date(Date.UTC(y, m - 1, d, hh || 0, mm || 0)).toISOString();
};

const parseSubcategories = (data: any): string[] => {
    if (Array.isArray(data)) {
        return data.filter(
            (item) => typeof item === "string" && item.trim() !== "" && item !== "[" && item !== "]"
        );
    }
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                return parsed.filter((item) => typeof item === "string");
            }
        } catch {
            return [];
        }
    }
    return [];
}

export function EditPromoDialog() {
    const { editingPromo, setEditingPromo, update,  isLoading, delete: del } = usePromoStore();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

    const isOpen = !!editingPromo;

    useEffect(() => {
        if (editingPromo) {
            reset({
                code: editingPromo.code || "",
                description: editingPromo.description || "",
                type: editingPromo.type || "PERCENT",
                value: editingPromo.value ?? 5,
                validFrom: formatIsoToPicker(editingPromo.validFrom),
                validUntil: formatIsoToPicker(editingPromo.validUntil),
                maxUses: editingPromo.maxUses ?? undefined,
                minOrderAmount: editingPromo.minOrderAmount ?? undefined,
                maxDiscount: editingPromo.maxDiscount ?? undefined,
                applicableSubcategories: parseSubcategories(editingPromo.applicableSubcategories),
            });
        }
    }, [editingPromo, reset]);

    const onSubmit = async (data: any) => {
        if (!editingPromo) return;

        const rawCategories = data.applicableSubcategories;
        const categoriesArray = Array.isArray(rawCategories) ? rawCategories : [];

        const payload = {
            ...data,
            applicableSubcategories: categoriesArray,
            value: Number(data.value),
            maxUses: data.maxUses ? Number(data.maxUses) : undefined,
            minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : undefined,
            maxDiscount: data.maxDiscount && Number(data.maxDiscount) > 0 ? Number(data.maxDiscount) : undefined,
            validFrom: parsePickerToIso(data.validFrom),
            validUntil: parsePickerToIso(data.validUntil),
        };

        const isSuccess = await update(editingPromo.id, payload);

        if (isSuccess) {
            setEditingPromo(null);
        }
    };

    const onDelete = async (id: string) => {

        const isSuccess = await del(id)

        if (isSuccess) {
            setEditingPromo(null);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && setEditingPromo(null)}>
            <DialogContent className="bg-[#1E1E22] border-gray-700 text-white sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-lg font-semibold text-white flex justify-between">
                        <div>
                            Редактирование: <span className="text-[#EC5B4D]">{editingPromo?.code}</span>
                        </div>
                        <Button onClick={()=>onDelete(editingPromo?.id)} className={'bg-[#46464E] rounded-[13px] py-2.75'}>Удалить</Button>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-300 font-medium">Код промокода</label>
                        <input
                            {...register("code", { required: "Код обязателен" })}
                            className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none"
                        />
                        {errors.code && <span className="text-red-500 text-xs">{errors.code.message as string}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-300 font-medium">Описание</label>
                        <input
                            {...register("description")}
                            className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-300 font-medium">Значение скидки</label>
                        <input
                            type="number"
                            {...register("value", { required: "Значение обязательно" })}
                            className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none"
                        />
                    </div>

                    <Controller
                        control={control}
                        name="applicableSubcategories"
                        render={({ field }) => (
                            <CategorySelect
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading}
                            />
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Controller
                            control={control}
                            name="validFrom"
                            render={({ field }) => (
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Дата начала"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="validUntil"
                            render={({ field }) => (
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Дата окончания"
                                />
                            )}
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setEditingPromo(null)}
                            className="flex-1 bg-[#242428] hover:bg-[#2C2C31] text-gray-300 text-sm py-3.5 rounded-[12px] transition-colors cursor-pointer"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-[#EC5B4D] hover:bg-[#d94f42] text-white text-sm font-medium py-3.5 rounded-[12px] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? "Сохранение..." : "Сохранить"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}