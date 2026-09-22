'use client'

import {useEffect, useState} from "react";
import {useProductStore} from "@/store/product.store";
import {useCategoryStore} from "@/store/category.store";
import {useProviderStore} from "@/store/provider.store";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {Controller, SubmitHandler, useFieldArray, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {productSchema} from "@/schemas/product.create.schema";
import Image from "next/image";
import {X} from "lucide-react";
import {DynamicFieldArray} from "@/components/shared/admin/product/dynamicFieldArray";
import {TEXT_FIELDS} from "@/components/shared/admin/product/static/textField";
import {SelectWithSearch} from "@/components/ui/selectWithSearch";
import {cn} from "@/lib/utils";
import {ImagePreview} from "@/components/ui/imagePreview";
import {toast} from "sonner";

type ProductFormValues = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

interface ProductFormProps {
    productId?: string;
    initialData?: any;
    className?: string;
}

export function ProductForm({ productId, initialData, className }: ProductFormProps) {
    const { adminCreate, adminUpdate, isLoading } = useProductStore();
    const { category, getForSelect, isLoading: isCategoriesLoading } = useCategoryStore();
    const { provider, getForSelect: providerSelect, isLoading: isProvidersLoading } = useProviderStore();

    const router = useRouter();
    const isEditMode = Boolean(productId);

    // Храним превью старой картинки (URL с бэкенда)
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
        initialData?.imageUrl || null
    );

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProductFormValues, any, ProductFormOutput>({
        resolver: zodResolver(productSchema),
        mode: "onTouched",
        defaultValues: {
            image: undefined,
            isClothes: false,
            subCategoryId: "",
            providerId: "",
            characteristic: [],
            size: [],
            taste: [],
        },
    });

    // При изменении/загрузке initialData подставляем значения в форму
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                shortDescription: initialData.shortDescription || "",
                description: initialData.description || "",
                advantages: initialData.advantages || "",
                structure: initialData.structure || "",
                formRelease: initialData.formRelease || "",
                defaultPrice: Number(initialData.defaultPrice) || 0,
                isClothes: Boolean(initialData.isClothes),
                subCategoryId: initialData.subCategoryId || initialData.subCategory?.id || "",
                providerId: initialData.providerId || initialData.Provider?.id || "",

                // Характеристики (characteristic или characteristics)
                characteristic: Array.isArray(initialData.characteristic)
                    ? initialData.characteristic.map((item: any) => ({
                        name: item.name || "",
                        value: item.value || "",
                    }))
                    : Array.isArray((initialData as any).characteristics)
                        ? (initialData as any).characteristics.map((item: any) => ({
                            name: item.name || "",
                            value: item.value || "",
                        }))
                        : [],

                // Размеры (Size или size)
                size: Array.isArray(initialData.Size)
                    ? initialData.Size.map((item: any) => ({
                        name: item.name || "",
                        price: Number(item.price) || 0,
                    }))
                    : Array.isArray((initialData as any).size)
                        ? (initialData as any).size.map((item: any) => ({
                            name: item.name || "",
                            price: Number(item.price) || 0,
                        }))
                        : [],

                // Вкусы (Taste или taste)
                taste: Array.isArray(initialData.Taste)
                    ? initialData.Taste.map((item: any) => ({
                        name: item.name || "",
                        price: Number(item.price) || 0,
                    }))
                    : Array.isArray((initialData as any).taste)
                        ? (initialData as any).taste.map((item: any) => ({
                            name: item.name || "",
                            price: Number(item.price) || 0,
                        }))
                        : [],
            });

            if (initialData.imageUrl) {
                setExistingImageUrl(initialData.imageUrl);
            }
        }
    }, [initialData, reset]);

    useEffect(() => {
        getForSelect();
        providerSelect();
    }, [getForSelect, providerSelect]);

    const watchedImage = useWatch({ control, name: "image" });
    const isClothes = useWatch({ control, name: "isClothes" });

    const charArray = useFieldArray({ control, name: "characteristic" });
    const sizeArray = useFieldArray({ control, name: "size" });
    const tasteArray = useFieldArray({ control, name: "taste" });

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        let isSuccess = false;

        if (isEditMode && productId) {
            isSuccess = await adminUpdate(productId, data);
        } else {
            // Если это создание, проверяем наличие файла вручную
            if (!data.image) {
                toast.error("Загрузите изображение товара");
                return;
            }
            isSuccess = await adminCreate(data);
        }

        if (isSuccess) {
            router.push("/admin/product");
        }
    };

    const onInvalid = (formErrors: any) => {
        toast.error("Заполните все обязательные поля");
        const firstErrorKey = Object.keys(formErrors)[0];
        if (firstErrorKey) {
            const el = document.querySelector(`[name="${firstErrorKey}"]`) || document.getElementById(firstErrorKey);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className={cn("flex flex-col gap-6 w-full", className)}>
            {/* Превью фото: Новое выложенное (File) ИЛИ Старое с бэка (URL) */}
            {watchedImage instanceof File ? (
                <ImagePreview
                    file={watchedImage}
                    onRemove={() => setValue("image", undefined as any, { shouldValidate: true })}
                />
            ) : existingImageUrl ? (
                <div className="relative w-fit">
                    <Image
                        src={existingImageUrl}
                        alt="Превью товара"
                        className="object-cover rounded-[14px]"
                        width={216}
                        height={271}
                    />
                    <button
                        type="button"
                        onClick={() => setExistingImageUrl(null)}
                        className="absolute top-2 right-1 bg-[#46464E] hover:bg-red-600 text-white p-3.5 rounded-[15px] shadow-md transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : null}

            {/* Блок с кнопками и селектами */}
            <div className="flex flex-col gap-3 max-w-52.75">
                {!watchedImage && !existingImageUrl && (
                    <div className="flex flex-col gap-1">
                        <label className="bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[14px] py-2.75 cursor-pointer text-sm transition-colors flex items-center justify-center">
                            Загрузить фото
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setValue("image", file as any, { shouldValidate: true });
                                        setExistingImageUrl(null);
                                    }
                                }}
                            />
                        </label>
                        {errors.image && <span className="text-red-500 text-xs ml-2">{errors.image.message as string}</span>}
                    </div>
                )}

                {/* Выбор Категории */}
                <Controller
                    control={control}
                    name="subCategoryId"
                    render={({ field }) => (
                        <SelectWithSearch
                            options={category}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Выбрать категорию"
                            isLoading={isCategoriesLoading}
                            error={errors.subCategoryId?.message}
                            fallbackLabel={initialData?.subCategory?.name}
                        />
                    )}
                />

                {/* Выбор Поставщика */}
                <Controller
                    control={control}
                    name="providerId"
                    render={({ field }) => (
                        <SelectWithSearch
                            options={provider}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Выбрать поставщика"
                            isLoading={isProvidersLoading}
                            error={errors.providerId?.message}
                            fallbackLabel={initialData?.Provider?.name}
                        />
                    )}
                />

                {/* Переключатель "Это одежда?" */}
                <div className="flex items-center gap-3 text-white text-sm ml-2 py-1 select-none">
                    <Controller
                        control={control}
                        name="isClothes"
                        render={({ field }) => (
                            <Switch
                                id="isClothes"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <label htmlFor="isClothes" className="cursor-pointer">
                        Это одежда?
                    </label>
                </div>
            </div>

            {/* Текстовые инпуты */}
            <div className="flex flex-col gap-4">
                {TEXT_FIELDS.map((field) => {
                    const fieldError = errors[field.name as keyof ProductFormValues];
                    return (
                        <div key={field.name}>
                            <label className="text-white text-sm ml-2 block mb-1">{field.label}</label>
                            <Input
                                id={field.name}
                                {...register(field.name as keyof ProductFormValues)}
                                placeholder={field.placeholder}
                                className={cn(
                                    "bg-[#2C2C31] border text-white rounded-[20px] px-7.5 py-5.75 focus-visible:ring-1",
                                    fieldError
                                        ? "border-red-500 focus-visible:ring-red-500"
                                        : "border-[#50505E] focus-visible:ring-red-500"
                                )}
                            />
                            {fieldError && (
                                <span className="text-red-500 text-xs ml-2 mt-1 block">
                                    {fieldError?.message as string}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Динамические массивы */}
            <div className="flex flex-col gap-6 py-2">
                <DynamicFieldArray
                    title="Добавить характеристики"
                    fieldName="characteristic"
                    valKey="value"
                    placeholder1="Имя (Вес упаковки)"
                    placeholder2="Значение (500 г)"
                    register={register}
                    errors={errors}
                    fieldArray={charArray}
                />

                <DynamicFieldArray
                    title="Добавить размеры"
                    fieldName="size"
                    valKey="price"
                    placeholder1="Размер (M, L, XL)"
                    placeholder2="Цена (+ к базе)"
                    isNumber
                    register={register}
                    errors={errors}
                    fieldArray={sizeArray}
                />

                <DynamicFieldArray
                    title={isClothes ? "Добавить цвета" : "Добавить вкусы"}
                    fieldName="taste"
                    valKey="price"
                    placeholder1={isClothes ? "Цвет (Черный, Белый)" : "Вкус (Клубника)"}
                    placeholder2="Цена (+ к базе)"
                    isNumber
                    register={register}
                    errors={errors}
                    fieldArray={tasteArray}
                />
            </div>

            {/* Стоимость товара */}
            <div className="w-1/2">
                <label className="text-white text-sm ml-2 block mb-1">Стоимость товара</label>
                <Input
                    id="defaultPrice"
                    type="number"
                    step="0.01"
                    {...register("defaultPrice", { valueAsNumber: true })}
                    placeholder="Введите стоимость товара..."
                    className={cn(
                        "bg-[#2A2A2A] border text-white rounded-[20px] px-7.5 py-5 focus-visible:ring-1",
                        errors.defaultPrice
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-transparent focus-visible:ring-red-500"
                    )}
                />
                {errors.defaultPrice && <span className="text-red-500 text-xs ml-2 mt-1 block">{errors.defaultPrice.message}</span>}
            </div>

            {/* Кнопки */}
            <div className="flex flex-row gap-2">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#D83C2D] hover:bg-[#b83325] text-white rounded-[13px] py-2.75 px-19.75"
                >
                    {isLoading ? "Сохранение..." : isEditMode ? "Обновить" : "Сохранить"}
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={() => router.push("/admin/product")}
                    className="py-2.75 px-12 bg-[#46464E] rounded-[13px]"
                >
                    Отмена
                </Button>
            </div>
        </form>
    );
}