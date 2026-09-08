'use client'

import {useEffect, useState, useTransition} from "react";
import {useCategoryStore} from "@/store/category.store";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {CategoryCard} from "@/components/shared/admin/category/categoryCard";
import {cn} from "@/lib/utils";

interface Props {
    className?: string;
}

export function CategoryCatalog({className}: Props) {
    // Вызов методов стора
    const { categories, fetchCategories, isLoading } = useCategoryStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    // Первоначальная загрузка
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Серверный поиск с обработкой по кнопке/Enter
    const handleSearch = () => {
        startTransition(() => {
            fetchCategories(searchQuery.trim());
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className={cn("  text-white   flex flex-col gap-8", className)}>

            <div className="relative flex items-center w-full border-[#50505E] border  bg-[#2C2C32] rounded-2xl p-1.5 focus-within:ring-1 focus-within:ring-neutral-500">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите категорию..."
                    className="bg-transparent  text-white placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-10 px-4"
                />
                <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={isLoading || isPending}
                    className="bg-[#3A3A42] hover:bg-[#4A4A54] text-white rounded-[12px] px-6 h-10 text-sm font-medium transition-colors cursor-pointer"
                >
                    {isLoading || isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Поиск"
                    )}
                </Button>
            </div>

            {/* Контент категорий */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20 text-[#8E8E93]">
                    <Loader2 className="w-8 h-8 animate-spin mr-2" />
                    <span>Загрузка категорий...</span>
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 text-[#8E8E93]">
                    Категории не найдены
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            )}
        </div>
    );
}