import {z} from "zod";


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Пароль должен быть не короче 6 символов")
})