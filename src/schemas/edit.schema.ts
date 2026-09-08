import {z} from "zod";

const isValidDateString = (dateString: string) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split('.');
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return (
        date.getFullYear() === Number(year) &&
        date.getMonth() === Number(month) - 1 &&
        date.getDate() === Number(day)
    );
};

export const EditSchema = z.object({
    // Разрешаем либо строку минимум из 2 символов, либо пустую строку
    secondName: z.string().min(2, "Минимум 2 символа").or(z.literal('')),
    firstName: z.string().min(2, "Минимум 2 символа").or(z.literal('')),
    birthDate: z.string()
        .or(z.literal(''))
        .refine((val) => val === '' || isValidDateString(val), { message: "Неверный формат. Используйте ДД.ММ.ГГГГ" })
        .transform((dateString) => {
            if (!dateString) return ""; // Замени undefined на пустую строку
            const [day, month, year] = dateString.split('.');
            const dateUTC = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
            return dateUTC.toISOString();
        }),
    number: z.string()
        .transform((val) => val.replace(/[\s()\-]/g, '')) // Убираем маску, если она есть
        .pipe(
            z.string().regex(/^\+375\d{9}$/, "Некорректный номер").or(z.literal(''))
        ),
}).refine((data) => {
    // Проверяем, что хотя бы одно поле имеет длину больше нуля
    return !!data.firstName || !!data.secondName || !!data.birthDate || !!data.number;
}, {
    message: "Заполните хотя бы одно поле для сохранения",
    path: ["root"] // Ошибка будет привязана к форме в целом, а не к конкретному полю
});