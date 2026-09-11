'use client'

import React, {useEffect} from "react";
import Image from "next/image";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "@/schemas/login.schema";
import {useAuthStore} from "@/store/auth.store";
import {DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginProps {
    onSwitchToRegister: () => void;
    onSwitchToRecovery: () => void;
    onClose: () => void;
    isOpen: boolean;
}

export function Login({ onSwitchToRegister, onSwitchToRecovery, onClose, isOpen }: LoginProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const { login, isLoading } = useAuthStore();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data.email, data.password);
            onClose();
        } catch (error) {}
    };

    const isPending = isLoading || isSubmitting;

    return (
        <>
            {/*
              Для мобилок (375px) уменьшена минимальная высота шапки min-h-[90px]
              Уменьшен внутренний отступ для мобилок p-4
            */}
            <DialogHeader className='shrink-0 relative flex justify-center items-center bg-[url("/bg-register.png")] bg-contain bg-center bg-no-repeat min-h-22.5 md:min-h-35 p-4 md:p-0'>
                <Image
                    className='absolute -top-12 left-0 w-31 h-33.5 md:-top-30 md:-left-8 md:w-50.75 md:h-55.75 z-20'
                    src={'/login.png'}
                    alt={'login'}
                    width={203}
                    height={223}
                />
                {/* Меньше шрифт и отступы для заголовка на 375px */}
                <DialogTitle className='text-black font-russo text-lg md:text-2xl py-2 md:py-10 z-10'>
                    Войдите в Corax
                </DialogTitle>
            </DialogHeader>

            {/*
              Уменьшены боковые отступы px-4 для узких экранов
              Добавлено скругление снизу rounded-b-[24px]
            */}
            <div className="flex-1 flex flex-col overflow-y-auto px-4 py-4 md:px-10 custom-scrollbar rounded-b-3xl">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="flex flex-col gap-4">
                        <div>
                            {/* Уменьшен padding (py-4) для мобилок, на десктопе py-6 */}
                            <Input
                                {...register("email")}
                                className="border-gray-400 border text-black py-4 md:py-6 pl-5 md:pl-7 w-full rounded-[13px]"
                                type="email"
                                placeholder="Введите электронную почту..."
                                disabled={isPending}
                            />
                            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                        </div>
                        <div>
                            <Input
                                {...register("password")}
                                className="border-gray-400 border text-black py-4 md:py-6 pl-5 md:pl-7 w-full rounded-[13px]"
                                type="password"
                                placeholder="Введите пароль..."
                                disabled={isPending}
                            />
                            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                        </div>
                    </div>

                    <div className="flex justify-center mt-2 md:mt-3">
                        <button
                            type="button"
                            onClick={onSwitchToRecovery}
                            disabled={isPending}
                            className="text-xs md:text-sm text-gray-500 hover:text-black underline cursor-pointer disabled:opacity-50"
                        >
                            Забыли пароль?
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="py-4 md:py-6 rounded-[13px] mt-4 mb-4 md:mt-6 md:mb-6"
                    >
                        {isPending ? "Вход..." : "Войти"}
                    </Button>
                </form>

                {/* Уменьшены отступы кнопок на мобильных */}
                <Button
                    type="button"
                    className="bg-white border border-[#EC5B4D] text-[#EC5B4D] hover:bg-[#EC5B4D] hover:text-white rounded-[13px] py-4 md:py-6 mb-3 transition-colors"
                    disabled={isPending}
                    onClick={onSwitchToRegister}
                >
                    Зарегистрироваться
                </Button>
                <Button className="py-4 md:py-6 mb-3 rounded-[13px]" disabled={isPending}>
                    Войти с помощью Google
                </Button>
                <Button className="py-4 md:py-6 mb-2 rounded-[13px]" disabled={isPending}>
                    Войти с помощью Яндекс
                </Button>
            </div>
        </>
    );
}