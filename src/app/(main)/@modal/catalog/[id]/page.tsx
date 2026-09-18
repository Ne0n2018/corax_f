'use client'

import {useParams, useRouter} from 'next/navigation'
import {ProductDetailModal} from "@/components/shared/productCatalog/productDetailModal";


export default function ProductModalPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params?.id as string

    return (
        <ProductDetailModal
            productId={productId}
            isOpen={true}
            onClose={() => router.back()}
            onSelectProduct={(id) => router.replace(`/catalog/${id}`, { scroll: false })}
        />
    )
}