'use client'

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useAuthStore} from "@/store/auth.store";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {NewPasswordSchema} from "@/schemas/password-recovery.schema";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";

type NewPasswordFormValues = z.infer<typeof NewPasswordSchema>;

export function PasswordRecoveryDialog() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { isLoading, newPassword } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NewPasswordFormValues>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    // Форма заблокирована, если выполняется загрузка или сабмит
    const isPending = isLoading || isSubmitting;

    // Извлекаем токен из URL
    const findToken = searchParams.get("token");

    // Окно открыто только при наличии токена
    const isOpen = Boolean(findToken);

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("token");

        const newQuery = params.toString();
        const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

        router.replace(newUrl, { scroll: false });
    };

    const onSubmit = async (value: NewPasswordFormValues) => {
        if (!findToken) return;

        try {
            await newPassword(findToken, value.password);
            handleClose();
        } catch (error) {
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-163.5 bg-white">
                <DialogHeader className='flex justify-center flex-row bg-[url("/bg-register.png")] bg-center bg-no-repeat'>
                    <Image
                        className='absolute -top-30.5 -left-8'
                        src={'https://s3-minsk-dc2.cloud.mts.by:443/mail/passwordRecovery.png'}
                        alt={'password recovery'}
                        width={203}
                        height={223}
                    />
                    <DialogTitle className='text-black font-russo mx-48 my-11.75'>
                        Восстановить пароль
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="flex flex-col gap-3.75">
                        <div>
                            <Input
                                {...register("password")}
                                className="border-gray-600 border text-black py-5.5 pl-7.5 w-full"
                                type="password"
                                placeholder="Введите пароль... "
                                disabled={isPending}
                            />
                            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                        </div>
                        <div>
                            <Input
                                {...register("confirmPassword")}
                                className="border-gray-600 border text-black py-5.5 pl-7.5 w-full"
                                type="password"
                                placeholder="Повторите пароль... "
                                disabled={isPending}
                            />
                            {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="py-3.5 rounded-[13px] mt-4 mb-6.25"
                    >
                        {isPending ? "Сохранение пароля..." : "Сохранить пароль"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}