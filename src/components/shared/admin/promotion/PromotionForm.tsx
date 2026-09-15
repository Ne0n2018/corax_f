'use client'

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {usePromotionStore} from "@/store/promotion.store";
import {DiscountMethodType, PromotionCreate, PromotionType} from "@/types/promotion";
import {Upload} from "lucide-react";
import {ImagePreview} from "@/components/ui/imagePreview";
import {zodResolver} from "@hookform/resolvers/zod";
import {createPromotionSchema} from "@/schemas/promotion.schema";
import {useRouter} from "next/navigation";

interface PromotionFormProps {
    promotionId?: string; // Если передан - форма работает в режиме редактирования
}

export function PromotionForm({ promotionId }: PromotionFormProps) {
    const { create, update, deletePromotion, getById, isLoading, promotion } = usePromotionStore();
    const router = useRouter();

    const isEditMode = !!promotionId;
    const [isFetching, setIsFetching] = useState(isEditMode);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createPromotionSchema),
        defaultValues: {
            name: "",
            description: "",
            type: PromotionType.FIRST_ORDER,
            discountMethod: DiscountMethodType.PERCENT,
            discountValue: 0,
            buyQuantity: "",
            getQuantity: "",
            popularTopN: "",
            active: true,
            expiresAt: "",
            image: null as File | string | null
        }
    });

    // Загрузка акции с сервера по ID
    useEffect(() => {
        if (isEditMode && promotionId) {
            const fetchPromotion = async () => {
                setIsFetching(true);
                await getById(promotionId);
                setIsFetching(false);
            };
            fetchPromotion();
        }
    }, [isEditMode, promotionId, getById]);

    // Подстановка данных акции в форму
    useEffect(() => {
        if (promotion && isEditMode) {
            reset({
                name: promotion.name,
                description: promotion.description || "",
                type: promotion.type,
                discountMethod: promotion.discountMethod,
                discountValue: promotion.discountValue,
                buyQuantity: promotion.buyQuantity ? String(promotion.buyQuantity) : "",
                getQuantity: promotion.getQuantity ? String(promotion.getQuantity) : "",
                popularTopN: promotion.popularTopN ? String(promotion.popularTopN) : "",
                active: promotion.active,
                expiresAt: promotion.expiresAt ? new Date(promotion.expiresAt).toISOString().slice(0, 16) : "",
                image: promotion.imageUrl
            });
        }
    }, [promotion, isEditMode, reset]);

    const currentType = watch("type");
    const currentImage = watch("image");

    const onSubmit = async (data: PromotionCreate) => {
        let buyQuantity: number | null = null;
        let getQuantity: number | null = null;
        let popularTopN: number | null = null;

        if (data.type === "BUY_X_GET_Y") {
            buyQuantity = data.buyQuantity ? Number(data.buyQuantity) : null;
            getQuantity = data.getQuantity ? Number(data.getQuantity) : null;
        } else if (data.type === "POPULAR") {
            popularTopN = data.popularTopN ? Number(data.popularTopN) : null;
        }

        // Подготовка изображения: отправляем File при загрузке нового, null при удалении, undefined если ссылка не менялась
        let imagePayload: File | null | undefined = undefined;
        if (data.image instanceof File) {
            imagePayload = data.image;
        } else if (data.image === null) {
            imagePayload = null;
        }

        const payload = {
            name: data.name,
            description: data.description || undefined,
            type: data.type,
            discountMethod: data.discountMethod,
            discountValue: Number(data.discountValue),
            buyQuantity,
            getQuantity,
            popularTopN,
            active: data.active,
            expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
            image: imagePayload
        };

        let isSuccess = false;

        if (isEditMode) {
            isSuccess = await update(promotionId, payload);
        } else {
            isSuccess = await create(payload);
        }

        if (isSuccess) {
            if (!isEditMode) reset();
            router.push("/admin/marketing/discount");
        }
    };

    const handleDelete = async () => {
        if (!isEditMode) return;

        const isConfirmed = window.confirm("Вы уверены, что хотите удалить эту акцию? Действие необратимо.");
        if (!isConfirmed) return;

        setIsDeleting(true);
        const isSuccess = await deletePromotion(promotionId);
        setIsDeleting(false);

        if (isSuccess) {
            router.push("/admin/marketing/discount");
        }
    };

    if (isFetching) {
        return <div className="text-gray-400 text-sm animate-pulse w-full h-full flex justify-center items-center">Загрузка данных акции...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Загрузка изображения */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-300 font-medium">Изображение акции</label>
                {currentImage ? (
                    <ImagePreview
                        file={currentImage}
                        onRemove={() => setValue("image", null, { shouldValidate: true })}
                    />
                ) : (
                    <label className="flex flex-col items-center justify-center w-[216px] h-[160px] border-2 border-dashed border-[#50505E] hover:border-[#EC5B4D] rounded-[14px] cursor-pointer bg-[#242428] transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">Загрузить фото</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setValue("image", file, { shouldValidate: true });
                            }}
                        />
                    </label>
                )}
            </div>

            {/* Название акции */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300 font-medium">Название</label>
                <input
                    {...register("name", { required: "Укажите название акции" })}
                    placeholder="Например: Скидка на первый заказ"
                    className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none"
                />
                {errors.name && <span className="text-red-500 text-xs">{String(errors.name.message)}</span>}
            </div>

            {/* Описание */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300 font-medium">Описание</label>
                <textarea
                    {...register("description")}
                    placeholder="Описание условий акции..."
                    rows={3}
                    className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none resize-none"
                />
            </div>

            {/* Тип акции и Метод скидки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-300 font-medium">Тип акции</label>
                    <select
                        {...register("type")}
                        className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none cursor-pointer"
                    >
                        <option value="FIRST_ORDER">На первый заказ (FIRST_ORDER)</option>
                        <option value="BUY_X_GET_Y">Купи X получи Y (BUY_X_GET_Y)</option>
                        <option value="POPULAR">Популярные товары (POPULAR)</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-300 font-medium">Тип скидки</label>
                    <select
                        {...register("discountMethod")}
                        className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none cursor-pointer"
                    >
                        <option value="PERCENT">Процент (%)</option>
                        <option value="FIXED">Фиксированная сумма</option>
                    </select>
                </div>
            </div>

            {/* Значение скидки */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300 font-medium">Размер скидки</label>
                <input
                    type="number"
                    {...register("discountValue", {
                        required: "Укажите значение скидки",
                        min: { value: 1, message: "Значение должно быть больше 0" }
                    })}
                    placeholder="15"
                    className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none"
                />
                {errors.discountValue && <span className="text-red-500 text-xs">{String(errors.discountValue.message)}</span>}
            </div>

            {/* Динамические поля по типам акций */}
            {currentType === "BUY_X_GET_Y" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#242428] p-4 rounded-[12px] border border-gray-700">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-300 font-medium">Купи количество (buyQuantity)</label>
                        <input
                            type="number"
                            {...register("buyQuantity", { required: "Обязательное поле для BUY_X_GET_Y" })}
                            placeholder="2"
                            className="bg-[#1E1E22] text-white text-sm px-4 py-3 rounded-[10px] outline-none"
                        />
                        {errors.buyQuantity && <span className="text-red-500 text-xs">{String(errors.buyQuantity.message)}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-300 font-medium">Получи количество (getQuantity)</label>
                        <input
                            type="number"
                            {...register("getQuantity", { required: "Обязательное поле для BUY_X_GET_Y" })}
                            placeholder="1"
                            className="bg-[#1E1E22] text-white text-sm px-4 py-3 rounded-[10px] outline-none"
                        />
                        {errors.getQuantity && <span className="text-red-500 text-xs">{String(errors.getQuantity.message)}</span>}
                    </div>
                </div>
            )}

            {currentType === "POPULAR" && (
                <div className="flex flex-col gap-1 bg-[#242428] p-4 rounded-[12px] border border-gray-700">
                    <label className="text-xs text-gray-300 font-medium">Топ N популярных товаров (popularTopN)</label>
                    <input
                        type="number"
                        {...register("popularTopN", { required: "Обязательное поле для POPULAR" })}
                        placeholder="10"
                        className="bg-[#1E1E22] text-white text-sm px-4 py-3 rounded-[10px] outline-none"
                    />
                    {errors.popularTopN && <span className="text-red-500 text-xs">{String(errors.popularTopN.message)}</span>}
                </div>
            )}

            {/* Дата окончания акции */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300 font-medium">Срок действия (необязательно)</label>
                <input
                    type="datetime-local"
                    {...register("expiresAt")}
                    className="bg-[#242428] text-white text-sm px-4 py-3.5 rounded-[12px] border border-transparent focus:border-gray-600 outline-none"
                />
            </div>

            {/* Статус активности */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="active"
                    {...register("active")}
                    className="w-4 h-4 accent-[#EC5B4D] rounded cursor-pointer"
                />
                <label htmlFor="active" className="text-sm text-gray-300 cursor-pointer">
                    Активная акция
                </label>
            </div>

            {/* Блок кнопок управления */}
            <div className="flex items-center gap-3 mt-2">
                <button
                    type="submit"
                    disabled={isLoading || isDeleting}
                    className="flex-1 bg-[#EC5B4D] hover:bg-[#d94f42] text-white font-medium py-3.5 px-4 rounded-[12px] transition-colors cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? "Сохранение..." : isEditMode ? "Сохранить изменения" : "Создать акцию"}
                </button>

            </div>
        </form>
    );
}