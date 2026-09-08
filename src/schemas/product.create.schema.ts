import z from "zod";

const variationSchema = z.object({
    name: z.string().min(1, "Введите название"),
    price: z.coerce.number().min(0, "Цена не может быть отрицательной"),
});

const characteristicSchema = z.object({
    name: z.string().min(1, "Введите название"),
    value: z.string().min(1, "Введите значение"),
});

export const productSchema = z.object({
    name: z.string().min(1, "Обязательное поле"),
    shortDescription: z.string().min(1, "Обязательное поле"),
    description: z.string().min(1, "Обязательное поле"),
    structure: z.string().min(1, "Обязательное поле"),
    advantages: z.string().min(1, "Обязательное поле"),
    formRelease: z.string().min(1, "Обязательное поле"),
    defaultPrice: z.coerce.number().min(0, "Цена не может быть отрицательной"),
    subCategoryId: z.string().min(1, "Выберите категорию"),
    providerId: z.string().min(1, "Выберите поставщика"),
    isClothes: z.boolean().default(false),

    characteristic: z.array(characteristicSchema).optional().default([]),
    size: z.array(variationSchema).optional().default([]),
    taste: z.array(variationSchema).optional().default([]),

    // Если файл передали — проверяем, что это File. Если нет (undefined/null) — пропускаем.
    image: z
        .any()
        .refine(
            (file) => !file || file instanceof File,
            "Выберите корректный файл изображения"
        )
        .optional(),
});