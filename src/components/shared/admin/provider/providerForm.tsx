'use client'

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {UploadCloud} from "lucide-react";
import {useProviderStore} from "@/store/provider.store";
import {ProviderFormValues, providerSchema} from "@/schemas/provider.schema";
import {cn} from "@/lib/utils";
import {ImagePreview} from "@/components/shared/admin/product/imagePreview";

interface ProviderFormProps {
    id?: string;
    className?: string;
}

export function ProviderForm({ id, className }: ProviderFormProps) {
    const router = useRouter();
    const { adminCreate, adminUpdate, getById, oneProvider, isLoading } = useProviderStore();

    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = Boolean(id);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProviderFormValues>({
        resolver: zodResolver(providerSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const watchedImageFile = watch("image")?.[0];

    useEffect(() => {
        if (id) {
            getById(id);
        }
    }, [id, getById]);

    useEffect(() => {
        if (id && oneProvider) {
            reset({
                name: oneProvider.name,
                description: oneProvider.description,
            });
            setExistingImageUrl(oneProvider.imageUrl);
        }
    }, [id, oneProvider, reset]);

    const onSubmit: SubmitHandler<ProviderFormValues> = async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);

        if (data.image && data.image.length > 0) {
            formData.append("image", data.image[0]);
        }

        let isSuccess = false;

        if (isEditMode && id) {
            isSuccess = await adminUpdate(id, formData);
        } else {
            isSuccess = await adminCreate(formData);
        }

        if (isSuccess) {
            router.push("/admin/provider");
        }
    };

    const { ref: registerRef, ...registerRest } = register("image");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-8 w-full max-w-200", className)}>

            {/* Изображение */}
            <div className="flex flex-col gap-2">
                <label className="text-white text-sm ml-2 block">Логотип поставщика</label>

                <div className="flex flex-col gap-2">
                    {/* Если есть новый файл или старая картинка — показываем превью. Иначе — кнопку выбора */}
                    {watchedImageFile instanceof File ? (
                        <ImagePreview
                            file={watchedImageFile}
                            onRemove={() => {
                                setValue("image", undefined as any, { shouldValidate: true });
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                        />
                    ) :  (
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[13px] py-2 px-6 transition-colors w-fit cursor-pointer"
                        >
                            <UploadCloud className="w-4 h-4 mr-2" />
                            Выберите изображение
                        </Button>
                    )}

                    {/* Скрытый инпут всегда доступен в DOM для вызова через ref */}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...registerRest}
                        ref={(e) => {
                            registerRef(e);
                            fileInputRef.current = e;
                        }}
                    />

                    {errors.image && (
                        <span className="text-red-500 text-xs mt-1 block">
                            {errors.image.message as string}
                        </span>
                    )}
                </div>
            </div>

            {/* Название */}
            <div className="flex flex-col gap-2">
                <label className="text-white text-sm ml-2 block">Название</label>
                <Input
                    {...register("name")}
                    placeholder="Введите название..."
                    className="bg-[#2C2C31] border-[#50505E] text-white rounded-[20px] px-6 py-5 focus-visible:ring-1 focus-visible:ring-red-500 h-15"
                />
                {errors.name && (
                    <span className="text-red-500 text-xs ml-2">{errors.name.message}</span>
                )}
            </div>

            {/* Описание */}
            <div className="flex flex-col gap-2">
                <label className="text-white text-sm ml-2 block">Описание</label>
                <textarea
                    {...register("description")}
                    placeholder="Введите описание..."
                    className="bg-[#2C2C31] border border-[#50505E] text-white rounded-[20px] px-6 py-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 min-h-30 resize-none"
                />
                {errors.description && (
                    <span className="text-red-500 text-xs ml-2">{errors.description.message}</span>
                )}
            </div>

            {/* Кнопки */}
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
                    onClick={() => router.push("/admin/provider")}
                    className="bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[13px] py-3 px-12 transition-colors cursor-pointer"
                >
                    Отмена
                </Button>
            </div>
        </form>
    );
}