'use client'

import * as React from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {callbackSchema} from "@/schemas/callback.schema";
import {useCallbackStore} from "@/store/callback.store";
import {useUserStore} from "@/store/user.store";

type CallbackFormValues = z.infer<typeof callbackSchema>;

interface CallbackDialogProps {
    trigger: React.ReactElement;
}

export function CallbackDialog({trigger}: CallbackDialogProps) {
    const [open, setOpen] = useState(false);
    const {callback, isLoading} = useCallbackStore();
    const user = useUserStore((state) => state.user);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CallbackFormValues>({
        resolver: zodResolver(callbackSchema),
        defaultValues: {
            phone: "",
        },
    });

    const isPending = isLoading || isSubmitting;

    // При открытии окна подставляем номер из профиля, если он заполнен
    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            reset({phone: user?.number ?? ""});
        }
        setOpen(nextOpen);
    };

    const onSubmit = async (values: CallbackFormValues) => {
        const isSuccess = await callback(values.phone);

        // При успехе закрываем окно, при ошибке оставляем открытым (тост показывает стор)
        if (isSuccess) {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={trigger}/>
            <DialogContent className="bg-white sm:max-w-120">
                <DialogHeader>
                    <DialogTitle className="text-black font-russo text-xl">
                        Заказать звонок
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="flex flex-col gap-2">
                        <label className="text-black text-sm">Номер телефона</label>
                        <Input
                            {...register("phone")}
                            type="tel"
                            placeholder="+375 (__) ___ __ __"
                            disabled={isPending}
                            className="border-gray-400 border text-black py-5.5 pl-7.5 w-full"
                        />
                        {errors.phone && (
                            <span className="text-red-500 text-sm">{errors.phone.message}</span>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="py-3.5 rounded-[13px] mt-4 mb-2 cursor-pointer"
                    >
                        {isPending ? "Отправка..." : "Отправить"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
