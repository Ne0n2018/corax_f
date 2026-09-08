'use client'
import {useForm} from "react-hook-form";
import {z} from "zod";
import {PasswordRecoverySchema} from "@/schemas/password-recovery.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, } from "@/components/ui/dialog";
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
                <DialogHeader className='flex justify-center flex-row bg-[url("/bg-register.png")] bg-center bg-no-repeat mb-6.5'>
                    <Image className='absolute -top-30.5 -left-8' src={'https://s3-minsk-dc2.cloud.mts.by:443/mail/passwordRecovery.png'} alt={'register'} width={203} height={223} />
                    <DialogTitle className='text-black font-russo mx-48 my-11.75'>
                        Восттановить пароль
                    </DialogTitle>
                </DialogHeader>
            <Button className={'bg-white text-[#737373] py-6.25 px-5.5 rounded-[20px] border-[#737373] hover:bg-[#737373] hover:text-white'} size={'icon-sm'} onClick={onSwitchToLogin}><MoveLeft /></Button>
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

            </>
    )
 }