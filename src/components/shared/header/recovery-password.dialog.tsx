'use client'
import {useForm} from "react-hook-form";
import {z} from "zod";
import {PasswordRecoverySchema} from "@/schemas/password-recovery.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import * as React from "react";
import {Input} from "@/components/ui/input";
import {MoveLeft} from "lucide-react";
import {useAuthStore} from "@/store/auth.store";


type RecoveryPasswordDValues = z.infer<typeof PasswordRecoverySchema>

interface RecoveryPasswordProps {
    onSwitchToLogin: () => void;
}
export function RecoveryPasswordDialog ({onSwitchToLogin}: RecoveryPasswordProps) {
    const {register, handleSubmit, formState:{errors, isSubmitting}, } = useForm<RecoveryPasswordDValues>({
        resolver: zodResolver(PasswordRecoverySchema),
        defaultValues: {
            email: ''
        }
    })

    const {isLoading, passwordRecovery} = useAuthStore()

    const onSubmit = (values:RecoveryPasswordDValues) => {
        passwordRecovery(values.email)
    }

    const isPending = isLoading || isSubmitting;

    return (
        <>
                <DialogHeader className='shrink-0 relative flex justify-center items-center bg-[url("/bg-register.png")] bg-contain bg-center bg-no-repeat min-h-22.5 md:min-h-35 p-4 md:p-0'>
                    <Image className='absolute -top-12 -left-7 w-31 h-33.5 md:-top-30 md:-left-8 md:w-50.75 md:h-55.75 z-20' src={'/password.png'} alt={'register'} width={203} height={223} />
                    <DialogTitle className='text-black font-russo text-lg md:text-2xl py-2 md:py-10 z-10'>
                        Восттановить пароль
                    </DialogTitle>
                </DialogHeader>
            <Button className={'bg-white text-[#737373] py-6.25 px-5.5 rounded-[20px] border-[#737373] hover:bg-[#737373] hover:text-white mt-2.5 ml-2.5'} size={'icon-sm'} onClick={onSwitchToLogin}><MoveLeft /></Button>
                <div className={'flex-1 flex flex-col overflow-y-auto px-4 py-4 md:px-10 custom-scrollbar rounded-b-3xl'}>
                    <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col mt-7.5 mb-94'}>
                        <div>
                            <Input
                                {...register('email')}
                                type={'email'}
                                placeholder='Введите email... '
                                disabled={isPending}
                                className='border-gray-600 border text-black py-5.5 pl-7.5 w-full'
                            />
                            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                        </div>

                        <Button
                            type='submit'
                            disabled={isPending}
                            className='py-3.5 rounded-[13px] mt-6 '
                        >
                            {isPending ? 'Письмо отправляется...' : "Отправить письмо"}
                        </Button>
                    </form>
                </div>

            </>
    )
 }