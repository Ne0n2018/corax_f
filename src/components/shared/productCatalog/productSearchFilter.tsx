'use client'
import {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCategoryStore} from "@/store/category.store";
import {useProductStore} from "@/store/product.store";
import {ChevronDown, ChevronUp} from "lucide-react";

export function ProductSearchFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlName = searchParams.get("name") || searchParams.get("search") || "";
    const urlSubCategory = searchParams.get("subCategoryId") || null;

    const [searchQuery, setSearchQuery] = useState(urlName);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(urlSubCategory);
    const [isExpanded, setIsExpanded] = useState(false);

    const { categories, fetchCategories } = useCategoryStore();
    const { getForCatalog } = useProductStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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

    const handleSearch = () => {
        const cleanSearch = searchQuery.trim();
        updateQueryParams(cleanSearch, selectedSubCategoryId);
        getForCatalog({
            name: cleanSearch,
            subCategoryId: selectedSubCategoryId || undefined,
        });
    };

    const handleSubCategorySelect = (subCategoryId: string) => {
        const nextSubCategoryId = selectedSubCategoryId === subCategoryId ? null : subCategoryId;
        setSelectedSubCategoryId(nextSubCategoryId);

        updateQueryParams(searchQuery, nextSubCategoryId);
        getForCatalog({
            name: searchQuery.trim(),
            subCategoryId: nextSubCategoryId || undefined,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative z-20 w-full text-white mb-8 shadow-xl flex flex-col justify-between">
            {/* Фоновая SVG-фигура */}
            <svg
                className="absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-xl"
                viewBox="0 0 1200 422"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1200 402C1200 413.046 1191.05 422 1180 422H282.971C274.971 422 267.74 417.232 264.588 409.878L245.195 364.627C242.043 352.506 234.813 352.506 226.812 352.506H20C8.9543 352.506 0 343.552 0 332.506V20C0 8.95431 8.95431 0 20 0H1180C1191.05 0 1200 8.95431 1200 20V402Z"
                    fill="#2C2C31"
                />
            </svg>

            {/* Верхний основной контент */}
            <div className="p-5 md:p-7 pb-2">
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
                {categories && categories.length > 0 && (
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden transition-all duration-300 ${
                            isExpanded ? "max-h-500 opacity-100 mb-4" : "max-h-55 md:max-h-45 opacity-90"
                        }`}
                    >
                        {categories.map((category) => {
                            const subList = category.SubCategory || [];

                            return (
                                <div key={category.id} className="flex flex-col space-y-2">
                                    <h3 className="font-bold text-base md:text-lg font-russo text-white">
                                        {category.name}
                                    </h3>
                                    <ul className="space-y-1 text-xs md:text-sm text-gray-300">
                                        {subList.map((subCat) => {
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
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Нижняя полка с кнопкой во всю ширину выступа */}
            <div className="w-full pl-[24%] pr-4 md:pr-8 pt-1 pb-3">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isExpanded ? "Свернуть фильтр" : "Развернуть фильтр"}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}