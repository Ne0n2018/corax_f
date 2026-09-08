'use client'

import {useProductStore} from "@/store/product.store";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Controller, SubmitHandler, useFieldArray, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {productSchema} from "@/schemas/product.create.schema";
import {DynamicFieldArray} from "@/components/shared/admin/product/dynamicFieldArray";
import {ImagePreview} from "@/components/shared/admin/product/imagePreview";
import {TEXT_FIELDS} from "@/components/shared/admin/product/static/textField";
import {cn} from "@/lib/utils";
import {useCategoryStore} from "@/store/category.store";
import {useEffect} from "react";
import {SelectWithSearch} from "@/components/ui/selectWithSearch";
import {useProviderStore} from "@/store/provider.store";

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductCreateProps {
    className?: string;
}


export function ProductCreate({className}: ProductCreateProps) {
    const { adminCreate, isLoading } = useProductStore();
    const {getForSelect, isLoading: isCategoryLoading, category} = useCategoryStore()
    const {getForSelect: getProvider, isLoading: isProvederLoading, provider} = useProviderStore()
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            image: undefined,
            isClothes: false,
            characteristic: [],
            size: [],
            taste: [],
        },
    });

    useEffect(() => {
        getForSelect()
        getProvider()
    }, [getForSelect, getProvider])

    // Отслеживаем изменения для UI
    const watchedImage = useWatch({ control, name: "image" });
    // Подписываемся на состояние чекбокса "Это одежда?"
    const isClothes = useWatch({ control, name: "isClothes" });

    const charArray = useFieldArray({ control, name: "characteristic" });
    const sizeArray = useFieldArray({ control, name: "size" });
    const tasteArray = useFieldArray({ control, name: "taste" });

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        const isSuccess = await adminCreate(data);
        if (isSuccess) {
            router.push("/admin/product");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6 w-full",className)}>
            {/* Превью фото */}
            {watchedImage instanceof File && (
                <ImagePreview
                    file={watchedImage}
                    onRemove={() => setValue("image", undefined as any, { shouldValidate: true })}
                />
            )}

            {/* Верхний блок: Загрузка фото, Селекты и Чекбокс */}
            <div className="flex flex-col gap-3 max-w-52.75">
                {!watchedImage && (
                    <div className="flex flex-col gap-1">
                        <label className="bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[14px] py-2.75 cursor-pointer text-sm transition-colors flex items-center justify-center">
                            Загрузить фото
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setValue("image", file as any, { shouldValidate: true });
                                }}
                            />
                        </label>
                        {errors.image && <span className="text-red-500 text-xs ml-2">{errors.image.message as string}</span>}
                    </div>
                )}

                <Controller control={control} render={
                    ({field}) => (<SelectWithSearch options={category} value={field.value} onChange={field.onChange} placeholder={'Выбрать категорию'} isLoading={isCategoryLoading} error={errors.subCategoryId?.message}/>)
                } name={'subCategoryId'}/>

                <Controller control={control} render={
                    ({field}) => (<SelectWithSearch options={provider} value={field.value} onChange={field.onChange} placeholder={'Выбрать поставщика'} isLoading={isProvederLoading} error={errors.providerId?.message}/>)
                } name={'providerId'}/>

                {/* ЧЕКБОКС: Перенесен наверх */}
                <label className="flex items-center gap-3 text-white text-sm cursor-pointer ml-2 py-1 select-none">
                    <Controller
                        control={control}
                        name="isClothes"
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-5 h-5 rounded bg-[#2A2A2A] border-none data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                            />
                        )}
                    />
                    Это одежда?
                </label>
            </div>

            {/* Текстовые инпуты */}
            <div className="flex flex-col gap-4">
                {TEXT_FIELDS.map((field) => (
                    <div key={field.name}>
                        <label className="text-white text-sm ml-2 block mb-1">{field.label}</label>
                        <Input
                            {...register(field.name as keyof ProductFormValues)}
                            placeholder={field.placeholder}
                            className="bg-[#2C2C31] border-[#50505E] text-white rounded-[20px] px-7.5 py-5.75 focus-visible:ring-1 focus-visible:ring-red-500"
                        />
                        {errors[field.name as keyof ProductFormValues] && (
                            <span className="text-red-500 text-xs ml-2 mt-1 block">
                                {errors[field.name as keyof ProductFormValues]?.message as string}
                            </span>
                        )}
                    </div>
                ))}
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

                {/* ДИНАМИЧЕСКИЙ БЛОК: Меняет Текст/Плейсхолдер в зависимости от isClothes */}
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
                    type="number"
                    {...register("defaultPrice", { valueAsNumber: true })}
                    placeholder="Введите стоимость товара..."
                    className="bg-[#2A2A2A] border-none text-white rounded-[20px] px-7.5 py-5 focus-visible:ring-1 focus-visible:ring-red-500"
                />
                {errors.defaultPrice && <span className="text-red-500 text-xs ml-2 mt-1 block">{errors.defaultPrice.message}</span>}
            </div>

            {/* Кнопки действия */}
            <div className="flex flex-row gap-2">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#D83C2D] hover:bg-[#b83325] text-white rounded-[13px] py-2.75 px-19.75"
                >
                    {isLoading ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button
                    type="button"
                    disabled={isLoading}
                    onClick={() => reset()}
                    className="py-2.75 px-12 bg-[#46464E] rounded-[13px]"
                >
                    Отмена
                </Button>
            </div>
        </form>
    );
}