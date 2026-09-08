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

export function Login({ onSwitchToRegister, onSwitchToRecovery,onClose, isOpen }: LoginProps) {
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

    useEffect(()=>{
        if (!isOpen) {
            reset()
        }
    }, [isOpen, reset]);

    const { login, isLoading } = useAuthStore();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data.email, data.password);
            onClose()
        } catch (error) {}
    };

    const isPending = isLoading || isSubmitting;

    return (
        <>
            <DialogHeader className='flex justify-center flex-row bg-[url("/bg-register.png")] bg-center bg-no-repeat'>
                <Image
                    className='absolute -top-30.5 -left-8'
                    src={'/login.png'}
                    alt={'login'}
                    width={203}
                    height={223}
                />
                <DialogTitle className='text-black font-russo mx-48 my-11.75'>
                    Войдите в Corax
                </DialogTitle>
            </DialogHeader>

            <div className={'flex flex-col overflow-y-auto max-h-[40vh]'}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="flex flex-col gap-3.75">
                        <div>
                            <Input
                                {...register("email")}
                                className="border-gray-600 border text-black py-5.5 pl-7.5 w-full"
                                type="email"
                                placeholder="Введите электронную почту... "
                                disabled={isPending}
                            />
                            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                        </div>
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
                    </div>

                    <div className="flex justify-center mt-2">
                        <button
                            type="button"
                            onClick={onSwitchToRecovery}
                            disabled={isPending}
                            className="text-sm text-gray-500 hover:text-black underline cursor-pointer disabled:opacity-50"
                        >
                            Забыли пароль?
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="py-3.5 rounded-[13px] mt-4 mb-6.25"
                    >
                        {isPending ? "Вход..." : "Войти"}
                    </Button>
                </form>

                <Button
                    type="button"
                    className="bg-white border-[#EC5B4D] text-[#EC5B4D] hover:bg-[#EC5B4D] hover:text-white rounded-[13px] py-3.5 mb-3"
                    disabled={isPending}
                    onClick={onSwitchToRegister}
                >
                    Зарегистрироваться
                </Button>
                <Button className="py-3.5 mb-3" disabled={isPending}>
                    Войти с помощью Google
                </Button>
                <Button className="py-3.5 mb-15" disabled={isPending}>
                    Войти с помощью Яндекс
                </Button>
            </div>
        </>
    );
}