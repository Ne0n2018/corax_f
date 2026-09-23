'use client'

import {Bell, LogOut, ShieldUser, UserRound} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import React from "react";
import {cn} from "@/lib/utils";
import {User} from "@/types/user";

interface LeftSideProps {
    user: User | null;
    isLoading: boolean;
    logOut: () => void;
    className?: string;
}

interface NavLink {
    href: string;
    label: string;
}

const navLinks: NavLink[] = [
    { href: '/account/comparison', label: 'Сравнение товаров' },
    { href: '/account/favourites', label: 'Избранное' },
    { href: '/account/orders', label: 'Ваши заказы' },
    { href: '/account/purchases', label: 'Ваши покупки' },
]

export function LeftSide({ user, isLoading, logOut, className }: LeftSideProps) {
    const pathname = usePathname()

    return (
        <div className={cn('bg-white rounded-[20px] p-8 sm:p-9.75 border border-gray-100 shadow-2xs flex flex-col justify-between', className)}>
            <div>
                {/* Шапка профиля */}
                <div className="flex justify-between flex-row bg-white items-center">
                    <div className="p-4 border-[#E1E1E1] text-[#A0A0A5] border rounded-full shadow-[0_0_4px_2px_#b3b3b320]">
                        <UserRound className="w-6 h-6" />
                    </div>
                    <div className="flex-1 ml-3.5">
                        <p className="text-black font-sans font-bold text-[14px]">
                            {user?.displayName || 'Пользователь'}
                        </p>
                        <Link
                            href="/account"
                            className={cn(
                                'text-[12px] font-sans transition-colors block mt-0.5',
                                pathname === '/account'
                                    ? 'text-[#D83C2D] font-semibold underline underline-offset-2'
                                    : 'text-[#737373] hover:text-black'
                            )}
                        >
                            Редактировать учетную запись
                        </Link>
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            className="bg-white text-black border border-black rounded-[15px] p-2.5 h-auto hover:bg-gray-50"
                        >
                            <Bell className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Навигационные кнопки разделов учётной записи */}
                <div className="flex flex-col gap-3 mt-6">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href

                        return (
                            <Link key={link.href} href={link.href} className="w-full">
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full py-4.5 rounded-[13px] border justify-start pl-7.5 text-sm font-medium transition-all cursor-pointer',
                                        isActive
                                            ? 'bg-[#2C2C31] text-white border-[#2C2C31] shadow-xs hover:bg-[#38383E] hover:text-white'
                                            : 'bg-white text-black border-[#B3B3B3] hover:bg-gray-50 hover:border-black'
                                    )}
                                >
                                    {link.label}
                                </Button>
                            </Link>
                        )
                    })}
                </div>

                {/* Кнопка перехода в панель администратора (для админов) */}
                {user?.role === 'ADMIN' && (
                    <div className="mt-4">
                        <Link href="/admin/product">
                            <Button className="px-4.5 py-4.5 w-full justify-start rounded-[13px] bg-[#2C2C31] hover:bg-[#38383E] text-white text-xs sm:text-sm">
                                <ShieldUser className="mr-2 w-4 h-4" />
                                Войти в панель администратора
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Нижний блок: Добавить аккаунт и Выйти из аккаунта */}
            <div className="pt-6 mt-6 border-t border-[#ECECEC] space-y-3">
                <Button
                    className="px-4.5 py-4 w-full justify-start rounded-[13px] bg-[#D83C2D] hover:bg-[#c43224] text-white font-medium text-sm transition-all cursor-pointer shadow-xs"
                    disabled={isLoading}
                    onClick={() => logOut()}
                >
                    <LogOut className="mr-3 w-4 h-4" />
                    Выйти из аккаунта
                </Button>
            </div>
        </div>
    )
}