import {z} from "zod";

export const categorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Введите название категории"),
    subCategory: z.array(
        z.object({
            id: z.string().optional(),
            name: z.string().min(1, "Введите название подкатегории"),
        })
    ).optional().default([]),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;