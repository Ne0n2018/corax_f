import {Bell, LogOut, ShieldUser, UserRound} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import {cn} from "@/lib/utils";
import {User} from "@/types/user";

interface leftSideProps {
    user: User | null
    isLoading: boolean;
    logOut: () => void;
    className?: string;
}

interface NavLink {
    href: string
    label: string
}

const navLinks:NavLink[] = [
    {href:'/comparison', label:'Сравнение товаров'},
    {href:'/favourites', label:'Избранное'},
    {href:'/order', label:'Ваши заказы'},
    {href:'/purchases', label:'Ваши покупки'},
]

export function LeftSide({user, isLoading, logOut, className}: leftSideProps) {
    return(
        <div className={cn('bg-white rounded-[20px] p-9.75', className)}>
            <div className="flex justify-between flex-row bg-white items-center">
                <div className="p-5 border-[#E1E1E1] text-[#E1E1E1] border rounded-4xl shadow-[0_0_4px_2px_#b3b3b340]">
                    <UserRound />
                </div>
                <div>
                    <p className={'text-black font-sans font-bold text-[14px]'}>{user?.displayName}</p>
                    <Link href={"/account"} className={'text-[#737373] font-sans text-[12px]'} >
                        Редактировать учетную запись
                    </Link>
                </div>
                <div>
                    <Button  variant="outline" className={'bg-white text-black border border-black rounded-[15px] p-3'} ><Bell /></Button>
                </div>
            </div>
            <div className="flex flex-col gap-3.75 mt-5">
                {navLinks.map((link) => (
                    <Button
                        key={link.href}
                        className="w-full text-black py-4.5 rounded-[13px] border bg-white border-[#B3B3B3] justify-start pl-7.5"
                    >
                        <Link href={link.href}>
                            {link.label}
                        </Link>
                    </Button>
                ))}
            </div>
            <div>
                {user?.role === 'ADMIN' && (
                    <Link href={'/admin/product'}>
                        <Button className={'px-4.5 py-5.25 w-full justify-start rounded-[13px] mt-6.25'}><ShieldUser /> Войти в панель администратора</Button>
                    </Link>
                )}
            </div>
            <div className={'border border-[#ECECEC] mt-5 mb-6.25'}/>
            <div>
                <Button className={'px-4.5 py-5.25 w-full justify-start rounded-[13px]'} disabled={isLoading} onClick={()=> logOut()}>
                    <LogOut className={'mr-3.75'}/>
                    Выйти из аккаунта
                </Button>
            </div>
        </div>
    )
}