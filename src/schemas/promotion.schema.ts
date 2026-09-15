import {z} from "zod";
import {DiscountMethodType, PromotionType} from "@/types/promotion";

// Вспомогательная функция для корректного преобразования пустых строк/null в числа
const optionalNumber = z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number({ error: "Укажите число" }).nullable().optional()
);

export const createPromotionSchema = z
    .object({
        name: z
            .string()
            .min(1, "Укажите название акции")
            .max(100, "Название слишком длинное"),

        description: z.string().optional(),

        // Для TypeScript enum используем nativeEnum
        type: z.enum(PromotionType),

        discountMethod: z.enum(DiscountMethodType),

        discountValue: z.coerce
            .number({ error: "Введите корректное число" })
            .min(1, "Размер скидки должен быть больше 0"),

        buyQuantity: optionalNumber,

        getQuantity: optionalNumber,

        popularTopN: optionalNumber,

        active: z.boolean().default(true),

        expiresAt: z.string().optional().nullable(),

        // Принимает как File (новое фото), так и string (URL существующего фото)
        image: z
            .union([
                z.custom<File>((val) => val instanceof File),
                z.string()
            ])
            .nullable()
            .optional(),
    })
    .superRefine((data, ctx) => {
        // 1. Условная валидация для BUY_X_GET_Y
        if (data.type === PromotionType.BUY_X_GET_Y) {
            if (!data.buyQuantity || data.buyQuantity <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Укажите количество приобретаемого товара (> 0)",
                    path: ["buyQuantity"],
                });
            }

            if (!data.getQuantity || data.getQuantity <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Укажите количество получаемого товара (> 0)",
                    path: ["getQuantity"],
                });
            }
        }

        // 2. Условная валидация для POPULAR
        if (data.type === PromotionType.POPULAR) {
            if (!data.popularTopN || data.popularTopN <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Укажите размер топа популярных товаров (> 0)",
                    path: ["popularTopN"],
                });
            }
        }

        // 3. Проверка процента скидки
        if (data.discountMethod === DiscountMethodType.PERCENT && data.discountValue > 100) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Скидка в процентах не может превышать 100%",
                path: ["discountValue"],
            });
        }
    });

export type CreatePromotionFormValues = z.input<typeof createPromotionSchema>;
export type CreatePromotionFormOutput = z.output<typeof createPromotionSchema>;