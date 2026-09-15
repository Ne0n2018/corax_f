'use client'

import React, {useEffect, useState} from "react";
import {usePromotionStore} from "@/store/promotion.store";
import {PromotionType} from "@/types/promotion";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {
    Calendar as CalendarIcon,
    Flame,
    Gift,
    Loader2 as LoaderIcon,
    Pencil as EditIcon,
    Search as SearchIcon,
    ShoppingBag,
    SlidersHorizontal as FilterIcon,
    X as ClearIcon
} from "lucide-react";
import Image from "next/image";
import {cn} from "@/lib/utils";
import Link from "next/link";

interface PromotionCatalogProps {
    className?: string;
}

export function PromotionCatalog({  className }: PromotionCatalogProps) {
    const { isLoading, promotions,  getAll } = usePromotionStore();

    // Состояния фильтрации
    const [searchName, setSearchName] = useState("");
    const [selectedType, setSelectedType] = useState<string>("ALL");
    const [selectedActive, setSelectedActive] = useState<string>("ALL");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            getAll({
                name: searchName || undefined,
                type: selectedType !== "ALL" ? (selectedType as PromotionType) : undefined,
                active: selectedActive === "ALL" ? undefined : selectedActive === "true",
            });
        };
        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchName, selectedType, selectedActive, getAll])

    const handleResetFilters = () => {
        setSearchName("");
        setSelectedType("ALL");
        setSelectedActive("ALL");
    };

    // Хелпер для отображения типа акции
    const renderTypeBadge = (type: PromotionType) => {
        switch (type) {
            case "FIRST_ORDER":
                return <Badge variant="secondary" className="gap-1"><Gift className="w-3 h-3" /> Первый заказ</Badge>;
            case "BUY_X_GET_Y":
                return <Badge variant="secondary" className="gap-1"><ShoppingBag className="w-3 h-3" /> Купи X получи Y</Badge>;
            case "POPULAR":
                return <Badge variant="secondary" className="gap-1"><Flame className="w-3 h-3" /> Популярное</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 w-full", className)}>
            {/* Верхняя панель: Поиск + Кнопка Фильтров */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 border border-[#50505E] rounded-[20px]">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Поиск акции по названию..."
                        className="pl-10 pr-10"
                    />
                    {searchName && (
                        <button
                            onClick={() => setSearchName("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <ClearIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Боковая панель фильтров */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger >
                        <Button  className="gap-2 relative bg-[#50505E]">
                            <FilterIcon className="w-4 h-4" />
                            <span>Фильтры</span>
                            {(selectedType !== "ALL" || selectedActive !== "ALL") && (
                                <span className="w-2 h-2 rounded-full bg-primary absolute top-1.5 right-1.5" />
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col justify-between px-3 py-7.5">
                        <div>
                            <SheetHeader className="mb-6">
                                <SheetTitle>Фильтры акций</SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-5">
                                {/* Фильтр по типу акции */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Тип акции</label>
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                        <SelectTrigger className={'w-full'}>
                                            <SelectValue placeholder="Все типы" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Все типы</SelectItem>
                                            <SelectItem value="FIRST_ORDER">Первый заказ (FIRST_ORDER)</SelectItem>
                                            <SelectItem value="BUY_X_GET_Y">Купи X получи Y (BUY_X_GET_Y)</SelectItem>
                                            <SelectItem value="POPULAR">Популярные (POPULAR)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Фильтр по активности */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Статус активности</label>
                                    <Select value={selectedActive} onValueChange={setSelectedActive}>
                                        <SelectTrigger className={'w-full'}>
                                            <SelectValue placeholder="Все статусы" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Все</SelectItem>
                                            <SelectItem value="true">Только активные</SelectItem>
                                            <SelectItem value="false">Неактивные</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="flex flex-col gap-3">
                            <Button  onClick={handleResetFilters} className="w-full bg-[#50505E]">
                                Сбросить
                            </Button>
                            <SheetClose >
                                <Button className="w-full">Применить</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Список / Сетка акций */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20 text-muted-foreground">
                    <LoaderIcon className="w-8 h-8 animate-spin" />
                </div>
            ) : promotions.length === 0 ? (
                <div className="text-center py-16 border border-dashed rounded-xl text-muted-foreground">
                    Акции не найдены
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {promotions.map((item) => (
                        <Card key={item.id} className="flex flex-col justify-between overflow-hidden">
                            <div>
                                {/* Шапка с картинкой и бейджем активности */}
                                <div className=" relative flex justify-center items-center">
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="object-cover"
                                            width={217}
                                            height={134}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                            Нет изображения
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {item.active ? (
                                            <Badge className="bg-promo-active hover:bg-emerald-700">Активна</Badge>
                                        ) : (
                                            <Badge className={'bg-promo-unactive'}>Неактивна</Badge>
                                        )}
                                    </div>
                                </div>

                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        {renderTypeBadge(item.type)}
                                        <div className="text-sm font-bold text-primary">
                                            {item.discountMethod === "PERCENT"
                                                ? `-${item.discountValue}%`
                                                : `-${item.discountValue} BYN`}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-3 text-sm ">
                                    {item.description && (
                                        <p className="line-clamp-2 text-xs">{item.description}</p>
                                    )}

                                    {/* Условные спецификации */}
                                    {item.type === "BUY_X_GET_Y" && (
                                        <div className="bg-muted/50 p-2.5 rounded-lg text-xs space-y-1">
                                            <div>Купи количество: <span className="font-semibold text-foreground">{item.buyQuantity ?? "-"}</span></div>
                                            <div>Получи количество: <span className="font-semibold text-foreground">{item.getQuantity ?? "-"}</span></div>
                                        </div>
                                    )}

                                    {item.type === "POPULAR" && (
                                        <div className="bg-muted/50 p-2.5 rounded-lg text-xs">
                                            Топ популярных товаров: <span className="font-semibold text-foreground">{item.popularTopN ?? "-"}</span>
                                        </div>
                                    )}

                                    {item.expiresAt && (
                                        <div className="flex items-center gap-1.5 text-xs  mt-1">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span>
                                                До: {new Date(item.expiresAt).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </div>

                            <CardFooter className="pt-2 border-t">
                               <Link href={`/admin/marketing/discount/${item.id}`} className={'w-full'}>
                                   <Button
                                       size="sm"
                                       className="w-full gap-2"
                                   >
                                       <EditIcon className="w-3.5 h-3.5" />
                                       Редактировать
                                   </Button>
                               </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}