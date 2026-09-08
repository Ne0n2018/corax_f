'use client'

import {useEffect, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useProviderStore} from "@/store/provider.store";
import {cn} from "@/lib/utils";

interface Props {
    className?: string;
}

export function ProviderCatalog({ className }: Props) {
    const { isLoading, providers, getAll } = useProviderStore()
    const [searchQuery, setSearchQuery] = useState("");

    // Загружаем все данные при первом рендере (пустой запрос)
    useEffect(() => {
        getAll("");
    }, [getAll]);

    // Функция обработчик поиска
    const handleSearch = () => {
        getAll(searchQuery);
    };

    // Обработчик нажатия Enter в поле ввода
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 p-4", className)}>
            <div className="w-full relative">
                <Input
                    type="text"
                    placeholder="Введите название поставщика..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-[#2C2C31] border-[#50505E] text-white placeholder:text-gray-400 rounded-[20px] px-7.5 py-8  focus-visible:ring-1 focus-visible:ring-red-500"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2  transition-colors cursor-pointer bg-[#46464E] rounded-[13px] px-10 py-2.75"
                >
                    поиск
                </button>
            </div>

            {/* Показываем лоадер только при первичном поиске, чтобы не скрывать уже загруженные товары при подгрузке */}
            {isLoading ? (
                <p className="text-white text-sm">Загрузка каталога...</p>
            ) : (
                <>
                    {providers.length === 0 ? (
                        <p className="text-white text-sm">Поставщики не найдены</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {providers.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="bg-white rounded-3xl px-8.25 py-1.75 flex flex-col justify-between min-h-85"
                                >
                                    <div className="relative w-full mb-3 flex items-center justify-center">
                                        <Image
                                            src={provider.imageUrl}
                                            alt={provider.name}
                                            className="max-h-full max-w-full object-contain"
                                            width={218}
                                            height={166}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 mb-1.5 flex-1">
                                        <p className="text-black font-bold text-lg leading-none">
                                            {provider.name}
                                        </p>
                                    </div>

                                    <Link href={`/admin/provider/${provider.id}`}>
                                        <Button
                                            className="w-full bg-[#D83C2D] hover:bg-[#b83325] text-white rounded-[14px] py-3 text-sm font-medium transition-colors cursor-pointer"
                                        >
                                            Редактировать
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}