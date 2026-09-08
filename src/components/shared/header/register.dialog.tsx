"use client";

import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import Image from "next/image";
import {registerSchema} from "@/schemas/register.schema";
import {useAuthStore} from "@/store/auth.store";
import * as React from "react";
import {useEffect} from "react";

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterProps {
    onSwitchToLogin: () => void;
    onClose: () => void;
    isOpen: boolean;
}

export function RegisterDialog({onSwitchToLogin, onClose, isOpen}: RegisterProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            consent: false,
        },
    });

    useEffect(() => {
        if (!isOpen) {
            reset()
        }
    }, [isOpen, reset]);

    const {isLoading, auth} = useAuthStore()

    const isPending = isLoading && isSubmitting;

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await auth(data.name, data.email, data.password, data.confirmPassword)
            onClose()
        } catch (error) {
            console.log(error)
        }
    };

    return (<>
                <DialogHeader className='flex justify-center flex-row bg-[url("/bg-register.png")] bg-center bg-no-repeat'>
                    <Image className='absolute -top-30.5 -left-8' src={"/register.png"} alt={'register'} width={203} height={223} />
                    <DialogTitle className='text-black font-russo mx-48 my-11.75'>
                        Зарегистрируйтесь в Corax
                    </DialogTitle>
                </DialogHeader>
                <div className={'flex flex-col overflow-y-auto max-h-[40vh] mt-2'}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                        <div className='flex flex-col gap-3.75'>
                            <div>
                                <Input
                                    {...register("name")}
                                    className='border-gray-600 border text-black py-5.5 pl-7.5 w-full'
                                    type='text'
                                    placeholder='Введите имя пользователя... '
                                    disabled={isPending}
                                />
                                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
                            </div>

                            <div>
                                <Input
                                    {...register("email")}
                                    className='border-gray-600 border text-black py-5.5 pl-7.5 w-full'
                                    type='email'
                                    placeholder='Введите электронный адрес... '
                                    disabled={isPending}
                                />
                                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                            </div>

                            <div>
                                <Input
                                    {...register("password")}
                                    className='border-gray-600 border text-black py-5.5 pl-7.5 w-full'
                                    type='password'
                                    placeholder='Введите пароль...'
                                    disabled={isPending}
                                />
                                {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                            </div>

                            <div>
                                <Input
                                    {...register("confirmPassword")}
                                    className='border-gray-600 border text-black py-5.5 pl-7.5 w-full'
                                    type='password'
                                    placeholder='Повторите пароль...'
                                    disabled={isPending}
                                />
                                {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>}
                            </div>
                        </div>

                        <FieldGroup className='mt-7.5'>
                            <Field orientation="horizontal">
                                {/* Для кастомных UI компонентов, таких как Checkbox, используется Controller */}
                                <Controller
                                    name="consent"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isPending}
                                        />
                                    )}
                                />
                                <FieldLabel className='text-black'>
                                    Я даю согласие на обработку моих персональных данных с целью создания и использования личного кабинета и подтверждаю, что до дачи согласия ознакомилась с информацией об обработке данных.
                                </FieldLabel>
                            </Field>
                            {errors.consent && <span className="text-red-500 text-sm">{errors.consent.message}</span>}
                        </FieldGroup>

                        <Button
                            type='submit'
                            disabled={isPending}
                            className='py-3.5 rounded-[13px] mt-6 mb-17.5'
                        >
                            {isPending?"Зарегистрироваться": "Регестрация"}
                        </Button>
                    </form>

                    <Button className='bg-white border-[#EC5B4D] text-[#EC5B4D] hover:text-white rounded-[13px] py-3.5 mb-3' disabled={isPending} onClick={()=>onSwitchToLogin()}>
                        Войти в аккаунт
                    </Button>
                    <Button className='py-3.5 mb-3' disabled={isPending}>Зарегистрироваться с помощью Google</Button>
                    <Button className='py-3.5 mb-15' disabled={isPending}>Зарегистрироваться с помощью Яндекс</Button>
                </div>
        </>
    );
}