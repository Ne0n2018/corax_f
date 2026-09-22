import z from "zod";

const variationSchema = z.object({
    name: z.string().trim().min(1, "Введите название"),
    price: z.coerce.number({ message: "Введите числовое значение" }).min(0, "Цена не может быть отрицательной"),
});

const characteristicSchema = z.object({
    name: z.string().trim().min(1, "Введите название"),
    value: z.string().trim().min(1, "Введите значение"),
});

export const productSchema = z.object({
    name: z.string().trim().min(1, "Введите название товара"),
    shortDescription: z.string().trim().min(1, "Введите краткое описание товара"),
    description: z.string().trim().min(1, "Введите описание товара"),
    structure: z.string().trim().min(1, "Введите состав товара"),
    advantages: z.string().trim().min(1, "Введите преимущества товара"),
    formRelease: z.string().trim().min(1, "Введите форму выпуска"),
    defaultPrice: z
        .preprocess(
            (val) => (val === "" || val === null || (typeof val === "number" && isNaN(val)) ? undefined : val),
            z.coerce.number({ message: "Укажите корректную стоимость товара" })
        )
        .refine((val) => typeof val === "number" && !isNaN(val) && val >= 0, {
            message: "Цена не может быть отрицательной",
        }),
    subCategoryId: z.string().trim().min(1, "Выберите категорию"),
    providerId: z.string().trim().min(1, "Выберите поставщика"),
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