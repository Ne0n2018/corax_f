"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowLeft, House, RotateCcw, SearchX, ServerCrash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";
import {cn} from "@/lib/utils";

interface ErrorPageProps {
    code: string;
    title: string;
    description: string;
    // Кнопка повтора (для 500)
    onRetry?: () => void;
    className?: string;
}

const ICONS = {
    "404": SearchX,
    "500": ServerCrash,
} as const;

export function ErrorPage({code, title, description, onRetry, className}: ErrorPageProps) {
    const router = useRouter();
    const Icon = ICONS[code as keyof typeof ICONS] ?? ServerCrash;

    return (
        <Container className={cn("px-4", className)}>
            <section
                className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-16 md:py-24">
                {/* Декоративные пятна на фоне */}
                <div
                    className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#EC5B4D]/20 blur-[110px]"/>
                <div
                    className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-[#EC5B4D]/10 blur-[90px]"/>

                <div
                    className="relative flex w-full max-w-2xl flex-col items-center rounded-[20px] border border-[#46464E] bg-[#2C2C31] px-5 py-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.45)] md:px-12 md:py-14">
                    <span
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#46464E] text-[#EC5B4D]">
                        <Icon size={30}/>
                    </span>

                    <p className="font-russo text-6xl leading-none text-white md:text-8xl">
                        {code}
                    </p>

                    <h1 className="font-russo mt-5 text-xl text-white md:text-3xl">
                        {title}
                    </h1>

                    <p className="mt-3 max-w-md text-sm text-white/70 md:text-base">
                        {description}
                    </p>

                    <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button
                            className="rounded-[13px] bg-white px-6 py-5.5 text-black hover:bg-gray-100"
                            onClick={() => router.push("/")}
                        >
                            <House size={18}/>
                            На главную
                        </Button>

                        {onRetry ? (
                            <Button
                                variant="outline"
                                className="rounded-[13px] border-[#46464E] bg-transparent px-6 py-5.5 text-white hover:bg-[#46464E] hover:text-white"
                                onClick={onRetry}
                            >
                                <RotateCcw size={18}/>
                                Попробовать снова
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="rounded-[13px] border-[#46464E] bg-transparent px-6 py-5.5 text-white hover:bg-[#46464E] hover:text-white"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft size={18}/>
                                Назад
                            </Button>
                        )}
                    </div>

                    <p className="mt-6 text-xs text-white/40">
                        Если ошибка повторяется —{" "}
                        <Link href="/contacts" className="underline underline-offset-2 hover:text-white/70">
                            свяжитесь с нами
                        </Link>
                    </p>
                </div>
            </section>
        </Container>
    );
}
