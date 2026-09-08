import {z} from "zod";

export const PasswordRecoverySchema = z.object({
    email: z.email(),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"], // Ошибка будет привязана к полю подтверждения
});