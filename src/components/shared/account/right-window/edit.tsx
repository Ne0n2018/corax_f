'use client'

import {cn, concatName} from "@/lib/utils";
import {UserData} from "@/components/shared/account/right-window/userData";
import {User} from "@/types/user";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {EditSchema} from "@/schemas/edit.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {useUserStore} from "@/store/user.store";
import {DateOfBirthField} from "@/components/shared/account/right-window/dateInput";
import {ArrowLeft} from "lucide-react";

type EditSchemaValue = z.infer<typeof EditSchema>

interface EditProps {
    user: User
    className?: string;
    onClose: () => void;
}

export function Edit({className, user, onClose}: EditProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        // Достаем isValid для блокировки кнопки и root для глобальных ошибок
        formState: { errors, isSubmitting, isValid },
    } = useForm<EditSchemaValue>({
        resolver: zodResolver(EditSchema),
        mode: "onChange", // Включаем валидацию при каждом изменении
        defaultValues: {
            firstName: '',
            secondName: '',
            birthDate: '',
            number: '',
        }
    })

    const {isLoading, updateMe} = useUserStore()

    const onSubmit = async (data: EditSchemaValue) => {
        await updateMe(concatName(data.firstName, data.secondName), data.number, data.birthDate as string)
        onClose();
    }

    const onBack = () => {
        reset()
        onClose()
    }

    const isPending = isLoading || isSubmitting;
    const isButtonDisabled = isPending || !isValid;

    return (
        <div className={cn('', className)}>
            <div>
                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-russo text-2xl">Редактирование учетной записи</h2>
                    <Button
                        type="button"
                        onClick={onBack}
                        className="bg-[#46464E] hover:bg-[#565660] p-5 rounded-[20px] shrink-0 text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-sm text-[#9E9E9E] mt-1">Ваши исходные данные</p>
                <UserData user={user} className="mt-5"/>
                <h2 className="text-[14px] my-5">Редактирование данных</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <div className="flex flex-col gap-3.75 ">
                    <div>
                        <Input
                            {...register("secondName")}
                            className="border-gray-600 border text-white py-5.5 pl-7.5 w-full bg-transparent"
                            type="text"
                            placeholder="Введите вашу фамилию..."
                            disabled={isPending}
                        />
                        {errors.secondName && <span className="text-red-500 text-sm mt-1">{errors.secondName.message}</span>}
                    </div>

                    <div>
                        <Input
                            {...register('firstName')}
                            className="border-gray-600 border text-white py-5.5 pl-7.5 w-full bg-transparent"
                            type="text"
                            placeholder="Введите ваше имя..."
                            disabled={isPending}
                        />
                        {errors.firstName && <span className="text-red-500 text-sm mt-1">{errors.firstName.message}</span>}
                    </div>

                    <div>
                        <DateOfBirthField control={control} errors={errors} disabled={isPending}/>
                    </div>

                    <div>
                        <Input
                            {...register('number')}
                            className="border-gray-600 border text-white py-5.5 pl-7.5 w-full bg-transparent"
                            type="text"
                            placeholder="Введите ваш номер телефона..."
                            disabled={isPending}
                        />
                        {errors.number && <span className="text-red-500 text-sm mt-1">{errors.number.message}</span>}
                    </div>
                </div>

                {errors.root && (
                    <span className="text-red-500 text-sm mt-2">
                        {errors.root.message}
                    </span>
                )}

                {/* Добавлен flex для работы gap-2 */}
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Button
                        type="submit"
                        disabled={isButtonDisabled}
                        className="w-full sm:w-auto py-2.75 px-19.5 rounded-[13px] text-sm bg-[#D83C2D] hover:bg-[#b83325] text-white"
                    >
                        {isPending ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                        type="button"
                        disabled={isButtonDisabled}
                        onClick={() => {
                            reset();
                        }}
                        className="w-full sm:w-auto py-2.75 px-12 rounded-[13px] bg-[#4C4C55] hover:bg-gray-600 text-sm text-white"
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    )
}