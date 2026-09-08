import {z} from "zod";

export const providerSchema = z.object({
    name: z.string().min(1, "Введите название поставщика"),
    description: z.string().min(1, "Введите описание"),
    image: z.any(),
});

export type ProviderFormValues = z.infer<typeof providerSchema>;