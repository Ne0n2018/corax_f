'use client'

import {useParams, usePathname, useRouter} from 'next/navigation'
import {ProductDetailModal} from "@/components/shared/productCatalog/productDetailModal";


export default function ProductModalPage() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const productId = params?.id as string

    // При мягкой навигации слот @modal сохраняет прежнее состояние: если основной
    // URL ушёл с /catalog/[id] (например, «Приобрести товар» ведёт на /cart),
    // модалку нужно убрать из рендера, иначе она останется висеть поверх новой страницы.
    const isModalRoute = /^\/catalog\/[^/]+$/.test(pathname || '')
    if (!isModalRoute) return null

    return (
        <ProductDetailModal
            productId={productId}
            isOpen={true}
            onClose={() => router.back()}
            onSelectProduct={(id) => router.replace(`/catalog/${id}`, { scroll: false })}
        />
    )
}