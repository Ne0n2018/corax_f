'use client'

import React from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {usePromoStore} from "@/store/promo.store";
import {PromoCreateFormInput, PromoCreateFormOutput, promoCreateSchema} from "@/schemas/promo.create.schema";
import {PromoCreate, PromoType} from "@/types/promo";
import {CategorySelect} from "@/components/shared/admin/promo/categorySelect";
import {DateTimePicker} from "@/components/shared/admin/promo/dateTimePicker";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation"; // Укажи путь к твоему стору


interface CreatePromoFormProps {
    onSuccess?: () => void;
    className?: string;
}

export function PromoForm({ className }: CreatePromoFormProps) {
    // Подключаем стор Zustand
    const { create, isLoading: isStoreLoading } = usePromoStore();

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<PromoCreateFormInput, any, PromoCreateFormOutput>({
        resolver: zodResolver(promoCreateSchema),
        defaultValues: {
            code: "",
            description: "Промокод",
            type: PromoType.PERCENT,
            value: 10,
            minOrderAmount: 0,
            maxDiscount: 0,
            validFrom: "",
            validUntil: "",
            maxUses: 100,
            applicableSubcategories: [],
        },
    });

    const isLoading = isStoreLoading || isSubmitting;
    const currentType = watch("type");

    const onSubmit = async (data: PromoCreateFormOutput) => {
        // Вызываем метод стора (он уже содержит API запрос и toast)
        const success = await create(data as PromoCreate);

        if (success) {
            reset(); // Очищаем форму при успехе
            router.push('/admin/marketing/promoCode') // Закрываем модальное окно, если передан колбэк
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-5 text-white w-full max-w-162.5 font-montserrat", className)}>

            {/* Код слово */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">Код слово</label>
                <input
                    {...register("code")}
                    type="text"
                    placeholder="Введите код слово..."
                    disabled={isLoading}
                    className="bg-[#242428] border border-transparent focus:border-gray-600 outline-none text-sm text-white px-4 py-3.5 rounded-[12px] placeholder:text-gray-500 w-full transition-colors disabled:opacity-50"
                />
                {errors.code && <span className="text-red-500 text-xs">{errors.code.message}</span>}
            </div>

            {/* Выберите тип скидки */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-xs text-gray-300 font-medium">Выберите тип скидки</label>

                {/* grid-cols-1 (мобилки) -> md:grid-cols-2 (десктоп) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    <button
                        type="button"
                        onClick={() => setValue("type", PromoType.PERCENT)}
                        disabled={isLoading}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-[#242428] border transition-all text-sm cursor-pointer disabled:opacity-50 ${
                            currentType === PromoType.PERCENT ? "border-gray-400 bg-[#2C2C31]" : "border-transparent opacity-70"
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            currentType === PromoType.PERCENT ? "bg-white/10 border-white" : "border-gray-600"
                        }`}>
                            {currentType === PromoType.PERCENT && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <span>Процент %</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setValue("type", PromoType.FIXED)}
                        disabled={isLoading}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-[#242428] border transition-all text-sm cursor-pointer disabled:opacity-50 ${
                            currentType === PromoType.FIXED ? "border-gray-400 bg-[#2C2C31]" : "border-transparent opacity-70"
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            currentType === PromoType.FIXED ? "bg-white/10 border-white" : "border-gray-600"
                        }`}>
                            {currentType === PromoType.FIXED && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <span>Фикс (пример, 20 р.)</span>
                    </button>
                </div>
            </div>

            {/* Минимальная сумма чека */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">Минимальная сумма чека</label>
                <input
                    {...register("minOrderAmount")}
                    type="number"
                    placeholder="Введите сумму чека..."
                    disabled={isLoading}
                    className="bg-[#242428] border border-transparent focus:border-gray-600 outline-none text-sm text-white px-4 py-3.5 rounded-[12px] placeholder:text-gray-500 w-full transition-colors disabled:opacity-50"
                />
                {errors.minOrderAmount && <span className="text-red-500 text-xs">{errors.minOrderAmount.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">Значение скидки</label>
                <input
                    {...register("value")}
                    type="number"
                    placeholder="Введите значение скидки..."
                    disabled={isLoading}
                    className="bg-[#242428] border border-transparent focus:border-gray-600 outline-none text-sm text-white px-4 py-3.5 rounded-[12px] placeholder:text-gray-500 w-full transition-colors disabled:opacity-50"
                />
                {errors.value && <span className="text-red-500 text-xs">{errors.value.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">Maксимальная сумма скидки</label>
                <input
                    {...register("maxDiscount")}
                    type="number"
                    placeholder="Введите максимальную скидку..."
                    disabled={isLoading}
                    className="bg-[#242428] border border-transparent focus:border-gray-600 outline-none text-sm text-white px-4 py-3.5 rounded-[12px] placeholder:text-gray-500 w-full transition-colors disabled:opacity-50"
                />
                {errors.maxDiscount && <span className="text-red-500 text-xs">{errors.maxDiscount.message}</span>}
            </div>


            {/* Выберите категорию */}
            <div className="flex flex-col gap-2">
                <Controller
                    control={control}
                    name={'applicableSubcategories'}
                    render={({ field, fieldState }) => (
                        <CategorySelect
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            </div>

            {/* Дата начала и окончания */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">Дата начала и окончания</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Дата начала */}
                    <Controller
                        control={control}
                        name="validFrom"
                        render={({ field, fieldState }) => (
                            <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Дата начала (ГГГГ.ММ.ДД.ЧЧ.ММ)"
                                defaultTime="00:00"
                                disabled={isLoading}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    {/* Дата окончания */}
                    <Controller
                        control={control}
                        name="validUntil"
                        render={({ field, fieldState }) => (
                            <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Дата окончания (ГГГГ.ММ.ДД.ЧЧ.ММ)"
                                defaultTime="23:59"
                                disabled={isLoading}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Лимит использования */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">Лимит использования</label>
                <input
                    {...register("maxUses")}
                    type="number"
                    placeholder="Введите количество"
                    disabled={isLoading}
                    className="bg-[#242428] border border-transparent focus:border-gray-600 outline-none text-sm text-white px-4 py-3.5 rounded-[12px] placeholder:text-gray-500 w-50 transition-colors disabled:opacity-50"
                />
                {errors.maxUses && <span className="text-red-500 text-xs">{errors.maxUses.message}</span>}
            </div>

            {/* Кнопка отправки */}
            <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-[#EC5B4D] hover:bg-[#d94f42] text-white font-medium py-3.5 rounded-[12px] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? "Создание..." : "Создать промокод"}
            </button>

        </form>
    );
}