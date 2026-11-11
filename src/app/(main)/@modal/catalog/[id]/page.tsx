'use client'

import {useEffect, useRef} from 'react'
import {useParams, usePathname, useRouter} from 'next/navigation'
import {ProductDetailModal} from "@/components/shared/productCatalog/productDetailModal";
import {useUserStore} from "@/store/user.store";
import {requireAuth} from "@/lib/require-auth";


export default function ProductModalPage() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const productId = params?.id as string

    // При мягкой навигации слот @modal сохраняет прежнее состояние: если основной
    // URL ушёл с /catalog/[id] (например, «Приобрести товар» ведёт на /cart),
    // модалку нужно убрать из рендера, иначе она останется висеть поверх новой страницы.
    const isModalRoute = /^\/catalog\/[^/]+$/.test(pathname || '')

    const user = useUserStore((s) => s.user)

    // Карточка товара доступна только авторизованным. Слот рендерится внутри
    // AppLoader, поэтому профиль к этому моменту уже определён.
    // notified — чтобы тост не появлялся повторно при перерисовке слота.
    const notified = useRef(false)
    useEffect(() => {
        if (isModalRoute && !user && !notified.current) {
            notified.current = true
            requireAuth("Карточка товара доступна только после входа в аккаунт")
            // Основной слот на /catalog/[id] пустой — возвращаем в каталог
            router.replace('/catalog')
        }
    }, [isModalRoute, user, router])

    if (!isModalRoute || !user) return null

    return (
        <ProductDetailModal
            productId={productId}
            isOpen={true}
            onClose={() => router.back()}
            onSelectProduct={(id) => router.replace(`/catalog/${id}`, { scroll: false })}
        />
    )
}