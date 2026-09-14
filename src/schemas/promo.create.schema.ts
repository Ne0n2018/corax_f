import {PromoType} from "@/types/promo";
import {z} from "zod";

// Предположим, у тебя есть enum для типов промокодов
// export enum PromoType { PERCENT = 'PERCENT', FIXED = 'FIXED' }

// Регулярка для формата ГГГГ.ММ.ДД.ЧЧ.ММ (например: 2026.12.30.23.59)
const dateFormatRegex = /^\d{4}\.(0[1-9]|1[012])\.(0[1-9]|[12][0-9]|3[01])\.([01][0-9]|2[0-3])\.([0-5][0-9])$/;

// Вспомогательная схема для валидации и трансформации даты
const dateSchema = z.string()
    .regex(dateFormatRegex, "Формат должен быть ГГГГ.ММ.ДД.ЧЧ.ММ (например: 2026.12.30.23.59)")
    .refine((val) => {
        const [year, month, day, hour, minute] = val.split('.').map(Number);
        const date = new Date(year, month - 1, day, hour, minute);

        // Проверяем существование даты (например, отсутствие 31 февраля)
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getHours() === hour &&
            date.getMinutes() === minute
        );
    }, { message: "Указана несуществующая дата или время" })
    .transform((val) => {
        const [year, month, day, hour, minute] = val.split('.').map(Number);
        // Переводим в UTC и возвращаем ISO-строку (2026-12-30T23:59:00.000Z)
        const dateUTC = new Date(Date.UTC(year, month - 1, day, hour, minute));
        return dateUTC.toISOString();
    });

export const promoCreateSchema = z.object({
    code: z.string().min(1, "Введите промокод").toUpperCase(),
    description: z.string().min(1, "Введите описание"),

    // Замени на z.nativeEnum(PromoType), если используешь enum
    type: z.enum(PromoType, {error: 'Выберете валидный тип скидки'}),

    value: z.coerce.number().min(1, "Значение должно быть больше 0"),
    validFrom: dateSchema,
    validUntil: dateSchema,
    maxUses: z.coerce.number().int().min(1, "Минимум 1 использование"),
    minOrderAmount: z.coerce.number().min(0, "Сумма не может быть отрицательной"),
    maxDiscount: z.coerce.number().min(0, "Скидка не может быть отрицательной"),
    applicableSubcategories: z.array(z.string()).default([]).optional(),
}).refine((data) => {
    // Проверяем, что дата окончания больше даты начала
    if (data.validFrom && data.validUntil) {
        return new Date(data.validUntil) > new Date(data.validFrom);
    }
    return true;
}, {
    message: "Дата окончания должна быть позже даты начала",
    path: ["validUntil"], // Привязываем ошибку к полю validUntil
});

// Тип для формы ДО трансформации (для инпутов: validFrom: "2026.12.30.23.59")
export type PromoCreateFormInput = z.input<typeof promoCreateSchema>;

// Тип ПОСЛЕ трансформации (для бэкенда: validFrom: "2026-12-30T23:59:00.000Z")
export type PromoCreateFormOutput = z.output<typeof promoCreateSchema>;