'use client'

import React from 'react'
import Link from 'next/link'
import { Scale, ShoppingBag } from 'lucide-react'

export default function AccountComparisonPage() {
    return (
        <div className="p-6 sm:p-7.5 bg-[#2C2C31] rounded-[20px] text-white min-h-[500px]">
            <div className="mb-6">
                <h2 className="text-white text-xl sm:text-2xl font-bold font-sans">
                    Сравнение товаров
                </h2>
                <p className="text-[#8E8E93] text-xs sm:text-sm mt-1">
                    Сравнивайте состав, свойства и цены разных позиций
                </p>
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="p-4 bg-white/5 rounded-full text-gray-400">
                    <Scale className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                        Нет товаров для сравнения
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
                        Добавляйте товары к сравнению в каталоге, чтобы сопоставить их характеристики
                    </p>
                </div>
                <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D83C2D] text-white font-medium text-xs sm:text-sm hover:bg-[#c43224] transition-colors"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Перейти в каталог
                </Link>
            </div>
        </div>
    )
}
