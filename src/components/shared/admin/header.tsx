"use client"

import {Container} from "@/components/ui/container";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {NavigationMenu, NavigationMenuItem, NavigationMenuList} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import * as React from "react";
import {useEffect} from "react";
import {HamburgerIcon} from "@/components/ui/navbar";
import {LogOut, MoveUpRight, UserRound} from "lucide-react";
import {useUserStore} from "@/store/user.store";
import Link from "next/link";
import {NavButton} from "@/components/shared/admin/navButton";

export interface HeaderNavLink {
    href: string
    label: string
    active?: boolean
}

const defaultNavigationLinks: HeaderNavLink[] = [
    { href: "/admin/product", label: "Управление каталогом", active: true },
    { href: '/admin/provider', label: 'Управление поставщиками' },
    { href: "/admin/order", label: "Управление заказами" },
    { href: "/admin/marketing", label: "Маркетинг" },
    { href: '/admin/user', label: 'Пользователи'}
]

// 1. Добавляем интерфейс для пропсов компонента
interface HeaderProps {
    navigationLinks?: HeaderNavLink[];
}

// 2. Оборачиваем аргумент в фигурные скобки { }
export function Header({ navigationLinks = defaultNavigationLinks }: HeaderProps) {

    const externalUrl = process.env.NEXT_PUBLIC_GRAFANA_URL || '/'

    const {user, getMe} = useUserStore()

    useEffect(() => {
        if (!user) {
            getMe();
        }
    }, [user, getMe]);

    return (
        <header>
            <Container className="bg-[#2C2C31]   py-4.5 rounded-[20px]">
                <div className={'flex justify-between px-5'}>
                    <Popover>
                        <PopoverTrigger >
                            <Button
                                className="group p-4.25 bg-[#46464E] rounded-[15px] hover:bg-accent hover:text-accent-foreground"
                                size="icon"
                                variant="ghost"
                            >
                                <HamburgerIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="px-9.75 py-7.25 bg-white w-109.25">
                            <div className={'flex gap-3.75 items-center'}>
                                <div className="p-5 border-[#E1E1E1] text-[#E1E1E1] border rounded-4xl shadow-[0_0_4px_2px_#b3b3b340]">
                                    <UserRound />
                                </div>
                                <div>
                                    <p className={'text-black font-sans font-bold text-[14px]'}>{user?.displayName}</p>
                                    <p className={'text-[#737373] text-sm'}>Главный администратор</p>
                                </div>
                            </div>
                            <NavigationMenu className="max-w-none mt-5">
                                <NavigationMenuList className="flex-col items-start gap-3.75">
                                    {navigationLinks.map((link, index) => (
                                        <NavigationMenuItem className="w-full" key={index}>
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    "flex items-center rounded-md px-7.5 py-4.75 font-medium transition-colors bg-white text-black  cursor-pointer no-underline border border-[#B3B3B3]",
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                            <div className={'flex flex-col gap-3.75 mt-5'}>
                                <Link className={''} href={externalUrl}>
                                    <Button className={'px-4.5 py-5.25 w-full rounded-[13px] bg-white text-black border border-[#B3B3B3] justify-start flex gap-3.75 items-center'}><MoveUpRight /> Перейти в Grafana</Button>
                                </Link>

                                <Link href={'/'}>
                                    <Button className={'px-4.5 py-5.25 w-full rounded-[13px] bg-[#D83C2D] flex gap-3.75 justify-start'}><LogOut /> Выйти из аккаунта</Button>
                                </Link>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <NavButton/>
                </div>
            </Container>
        </header>
    )
}