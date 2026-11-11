'use client'
import {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCategoryStore} from "@/store/category.store";
import {ChevronDown, ChevronUp} from "lucide-react";

// Сколько подкатегорий показываем сразу, остальные — по кнопке «Показать ещё»
const SUB_PREVIEW_LIMIT = 4;

export function ProductSearchFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlName = searchParams.get("name") || searchParams.get("search") || "";
    const urlSubCategory = searchParams.get("subCategoryId") || null;

    const [searchQuery, setSearchQuery] = useState(urlName);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(urlSubCategory);
    const [isExpanded, setIsExpanded] = useState(false);
    // Какие категории развернуты вручную (нет значения — решение по выбранной подкатегории)
    const [openedCategories, setOpenedCategories] = useState<Record<string, boolean>>({});

    const { publicCategories, fetchPublicCategories } = useCategoryStore();

    useEffect(() => {
        fetchPublicCategories();
    }, [fetchPublicCategories]);

    useEffect(() => {
        setSearchQuery(urlName);
        setSelectedSubCategoryId(urlSubCategory);
    }, [urlName, urlSubCategory]);

    const updateQueryParams = (name: string, subCategoryId: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (name.trim()) {
            params.set("name", name.trim());
        } else {
            params.delete("name");
            params.delete("search");
        }

        if (subCategoryId) {
            params.set("subCategoryId", subCategoryId);
        } else {
            params.delete("subCategoryId");
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Данные каталога перезапрашивает Catalog по изменению URL,
    // поэтому здесь достаточно обновить query-параметры
    const handleSearch = () => {
        const cleanSearch = searchQuery.trim();
        updateQueryParams(cleanSearch, selectedSubCategoryId);
    };

    const handleSubCategorySelect = (subCategoryId: string) => {
        const nextSubCategoryId = selectedSubCategoryId === subCategoryId ? null : subCategoryId;
        setSelectedSubCategoryId(nextSubCategoryId);

        updateQueryParams(searchQuery, nextSubCategoryId);
    };

    const toggleCategory = (categoryId: string, currentlyOpened: boolean) => {
        setOpenedCategories((prev) => ({ ...prev, [categoryId]: !currentlyOpened }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative z-20 w-full text-white mb-8 flex flex-col drop-shadow-xl">
            {/* Основной блок панели — сплошной фон вместо SVG-фигуры */}
            <div className="relative bg-[#2C2C31] rounded-t-[20px] rounded-bl-[20px] p-5 md:p-7 pb-6">
                {/* Заголовок */}
                <h2 className="text-xl md:text-2xl font-bold font-russo mb-4">
                    Скорее найди свой товар!
                </h2>

                {/* Поле поиска */}
                <div className="relative w-full mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Введите название товара..."
                        className="w-full bg-[#2a2c32] text-white placeholder-gray-400 border border-[#3b3d45] rounded-2xl py-3.5 pl-4 pr-32 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#3f424b] hover:bg-[#4d515c] text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                        Поиск
                    </button>
                </div>

                {/* Список категорий */}
                {publicCategories && publicCategories.length > 0 && (
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden transition-all duration-300 ${
                            isExpanded ? "max-h-500 opacity-100 mb-4" : "max-h-55 md:max-h-45 opacity-90"
                        }`}
                    >
                        {publicCategories.map((category) => {
                            const subList = category.SubCategory || [];
                            const selectedIndex = subList.findIndex((sub) => sub.id === selectedSubCategoryId);
                            // Если выбранная подкатегория спрятана — раскрываем список автоматически
                            const isOpened = openedCategories[category.id] ?? selectedIndex >= SUB_PREVIEW_LIMIT;
                            const hasMore = subList.length > SUB_PREVIEW_LIMIT;
                            const visibleSubs = hasMore && !isOpened
                                ? subList.slice(0, SUB_PREVIEW_LIMIT)
                                : subList;

                            return (
                                <div key={category.id} className="flex flex-col space-y-2">
                                    <h3 className="font-bold text-base md:text-lg font-russo text-white">
                                        {category.name}
                                    </h3>
                                    <ul className="space-y-1 text-xs md:text-sm text-gray-300">
                                        {visibleSubs.map((subCat) => {
                                            const isSelected = selectedSubCategoryId === subCat.id;
                                            return (
                                                <li key={subCat.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSubCategorySelect(subCat.id)}
                                                        className={`text-left hover:text-white transition-colors cursor-pointer ${
                                                            isSelected
                                                                ? "text-[#D83C2D] font-semibold underline"
                                                                : "text-gray-300"
                                                        }`}
                                                    >
                                                        {subCat.name}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* Кнопка раскрытия оставшихся подкатегорий — следующей строкой */}
                                    {hasMore && (
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(category.id, isOpened)}
                                            className="self-start inline-flex items-center gap-1 text-xs font-medium text-[#D83C2D] hover:text-white transition-colors cursor-pointer"
                                        >
                                            {isOpened ? "Свернуть" : `Показать ещё (${subList.length - SUB_PREVIEW_LIMIT})`}
                                            {isOpened
                                                ? <ChevronUp className="w-3.5 h-3.5" />
                                                : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* S-образный выступ: SVG-изгиб + полка с кнопкой */}
            <div className="relative h-14 -mt-px">
                {/* Мобильный изгиб: сдвинут на те же 66 юнитов влево, что и язычок
                    каталога, — тёмный изгиб остаётся правее белого (шов сходится) */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none sm:hidden"
                    viewBox="0 0 375 69.494"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 0H160.7C168.7 0 175.9 0 179.1 12.121L198.5 57.372C201.6 64.726 208.9 69.494 216.8 69.494H355C366.05 69.494 375 60.54 375 49.494V0H20Z"
                        fill="#2C2C31"
                    />
                </svg>

                {/* Изгиб растягивается на всю ширину (preserveAspectRatio="none"),
                    поэтому его границы 18.9%–23.6% совпадают с белым язычком каталога */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block"
                    viewBox="0 0 1200 69.494"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 0H226.812C234.813 0 242.043 0 245.195 12.121L264.588 57.372C267.74 64.726 274.971 69.494 282.971 69.494H1180C1191.05 69.494 1200 60.54 1200 49.494V0H20Z"
                        fill="#2C2C31"
                    />
                </svg>

                {/* Кнопка «Развернуть» — в полке выступа, правее изгиба.
                    На мобилке изгиб доходит до 58% ширины, поэтому полка там же */}
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute left-[62%] sm:left-[26%] right-4 top-1/2 -translate-y-1/2 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isExpanded ? "Свернуть фильтр" : "Развернуть фильтр"}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}