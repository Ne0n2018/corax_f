"use client";

import {useSyncExternalStore} from "react";
import Link from "next/link";
import {Cookie} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";
import {useCookieConsentStore} from "@/store/cookie-consent.store";
import {useUserStore} from "@/store/user.store";

// Пустая подписка — нужна только чтобы отличить сервер от клиента
const emptySubscribe = () => () => {};

export function CookieConsentBanner() {
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    const consent = useCookieConsentStore((state) => state.consent);
    const acceptCookies = useCookieConsentStore((state) => state.acceptCookies);
    const rejectCookies = useCookieConsentStore((state) => state.rejectCookies);

    // Не рендерим на сервере и после того, как решение уже принято
    if (!isClient || consent !== null) return null;

    const handleAccept = () => {
        acceptCookies();
        // Если ранее авторизация была заблокирована отказом — подтягиваем профиль
        useUserStore.getState().getMe();
    };

    const handleReject = () => {
        rejectCookies();
        // Отказ от cookie — блокируем авторизацию и сбрасываем текущую сессию
        useUserStore.getState().logout();
    };

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-100 px-4 pb-4">
            <Container className="pointer-events-auto max-w-5xl">
                <div
                    className="flex flex-col gap-4 rounded-[20px] border border-[#46464E] bg-[#2C2C31] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)] md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="flex items-start gap-3 md:items-center">
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#46464E] text-white">
                            <Cookie size={20}/>
                        </span>
                        <p className="text-sm text-white/90 md:text-base">
                            Мы используем cookie-файлы, чтобы сайт работал корректно, а также для
                            авторизации и улучшения сервиса. Продолжая пользоваться сайтом, вы
                            соглашаетесь с{" "}
                            <Link href="/" className="underline hover:text-white">
                                политикой конфиденциальности
                            </Link>
                            .
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-3">
                        <Button
                            className="rounded-[13px] bg-white px-6 py-4.5 text-black hover:bg-gray-100"
                            onClick={handleAccept}
                        >
                            Принять
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-[13px] border-[#46464E] bg-transparent px-6 py-4.5 text-white hover:bg-[#46464E] hover:text-white"
                            onClick={handleReject}
                        >
                            Отказаться
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}
