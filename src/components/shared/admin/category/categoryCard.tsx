import {Category} from "@/types/category";
import {useState} from "react";
import Link from "next/link";

export function CategoryCard({ category }: { category: Category }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Достаем SubCategory напрямую
    const subCategories = category.SubCategory || [];

    const hasMoreThanLimit = subCategories.length > 10;
    const visibleSubCategories = isExpanded
        ? subCategories
        : subCategories.slice(0, 10);

    return (
        <div className="flex flex-col gap-3">
            <Link href={`/admin/category/${category.id}`}>
                <h3 className="text-lg font-bold text-white tracking-wide">
                    {category.name}
                </h3>
            </Link>

            <ul className="flex flex-col gap-1.5">
                {visibleSubCategories.map((sub) => (
                    <li key={sub.id}>
                        <Link
                            href={`/admin/subCategory/${sub.id}`}
                            className="text-sm text-white hover:text-white transition-colors block py-0.5"
                        >
                            {sub.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {hasMoreThanLimit && (
                <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-xs text-[#71717A] hover:text-white transition-colors text-left mt-1 cursor-pointer"
                >
                    {isExpanded ? "Свернуть" : "Полный список"}
                </button>
            )}
        </div>
    );
}