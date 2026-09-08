'use client'

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {SubmitHandler, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {X} from "lucide-react";
import {useCategoryStore} from "@/store/category.store";
import {CategoryFormOutput, CategoryFormValues, categorySchema} from "@/schemas/category.create.schema";
import {cn} from "@/lib/utils";

interface CategoryFormProps {
    id?: string;
    className?: string;
}

export function CategoryForm({ id, className }: CategoryFormProps) {
    const router = useRouter();
    const {
        adminCreate,
        adminUpdate,
        categories,
        getCategoriesById, // или метод получения всего списка категорий
        isLoading
    } = useCategoryStore();

    const isEditMode = Boolean(id);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormValues, any, CategoryFormOutput>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            subCategory: [{ name: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subCategory",
    });

    // Берем категорию из массива categories в сторе
    useEffect(() => {
        if (!id) return;

        // Если стор пуст (например, при прямой перезагрузке страницы по URL) — подгружаем список
        if (categories.length === 0 ) {
            getCategoriesById(id);
            return;
        }

        const category = categories.find((item) => item.id === id);

        if (category) {
            const mappedSubCategories = category.SubCategory?.map((sub) => ({
                id: sub.id,
                name: sub.name,
            })) || [];

            reset({
                id: category.id,
                name: category.name,
                subCategory: mappedSubCategories.length > 0 ? mappedSubCategories : [{ name: "" }],
            });
        }
    }, [id, categories, getCategoriesById, reset]);

    const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
       
        const cleanedData = {
            ...data,
            subCategories: data.subCategory.filter((sub) => sub.name.trim() !== ""),
        };

        let isSuccess

        if (isEditMode && id) {
            isSuccess = await adminUpdate(id, cleanedData);
        } else {
            isSuccess = await adminCreate(cleanedData);
        }

        if (isSuccess) {
            router.push("/admin/category");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-8 w-full ", className)}>

            {/* Поле названия категории */}
            <div className="flex flex-col gap-2">
                <label className="text-white text-sm ml-2 block">Название категории</label>
                <Input
                    {...register("name")}
                    placeholder="Введите название категории..."
                    className="bg-[#2C2C31] border-[#50505E] text-white rounded-[20px] px-6 py-5 focus-visible:ring-1 focus-visible:ring-red-500 h-15"
                />
                {errors.name && (
                    <span className="text-red-500 text-xs ml-2">{errors.name.message}</span>
                )}
            </div>

            {/* Поля подкатегорий */}
            <div className="flex flex-col gap-4">
                <label className="text-white text-sm ml-2 block">Название подкатегории</label>

                <div className="flex flex-col gap-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative flex flex-col gap-1">
                            <div className="relative">
                                <Input
                                    {...register(`subCategory.${index}.name`)}
                                    placeholder="Введите название подкатегории..."
                                    className="bg-[#2C2C31] border-[#50505E] text-white rounded-[20px] px-6 py-5 pr-14 focus-visible:ring-1 focus-visible:ring-red-500 h-15"
                                />
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-red-500 transition-colors p-2"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            {errors.subCategory?.[index]?.name && (
                                <span className="text-red-500 text-xs ml-2">
                                    {errors.subCategory[index]?.name?.message}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    onClick={() => append({ name: "" })}
                    className="w-fit bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[13px] py-3 px-6 text-sm transition-colors mt-2 cursor-pointer"
                >
                    Добавить подкатегорию
                </Button>
            </div>

            {/* Кнопки управления */}
            <div className="flex flex-row gap-3 mt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#D83C2D] hover:bg-[#b83325] text-white rounded-[13px] py-3 px-12 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {isLoading
                        ? "Сохранение..."
                        : isEditMode
                            ? "Обновить"
                            : "Сохранить"}
                </Button>

                <Button
                    type="button"
                    disabled={isLoading}
                    onClick={() => router.push("/admin/category")}
                    className="bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[13px] py-3 px-12 transition-colors cursor-pointer"
                >
                    Отмена
                </Button>
            </div>
        </form>
    );
}