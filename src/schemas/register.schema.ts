import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
    confirmPassword: z.string(),
    consent: z.boolean().refine((val) => val === true, {
        message: "Необходимо согласие на обработку данных",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"], // Ошибка будет привязана к полю подтверждения
});