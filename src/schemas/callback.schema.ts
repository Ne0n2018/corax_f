import {z} from "zod";

export const callbackSchema = z.object({
    phone: z
        .string()
        .min(1, "Введите номер телефона")
        .regex(/^\+?[0-9\s()-]{7,20}$/, "Введите корректный номер телефона"),
});
