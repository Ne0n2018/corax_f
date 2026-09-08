'use client'

import {useEffect} from "react";
import {useParams} from "next/navigation";
import {useProductStore} from "@/store/product.store";
import {ProductForm} from "@/components/shared/admin/product/productForm";
import {Container} from "@/components/ui/container";
// или где лежать будет форма

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    const { currentProduct, adminGetById, isLoading } = useProductStore();

    useEffect(() => {
        if (id) {
            adminGetById(id);
        }
    }, [id, adminGetById]);

    if (isLoading || !currentProduct) {
        return <div className="text-white p-6">Загрузка данных товара...</div>;
    }

    return (
        <Container className="px-5 py-7.5 bg-[#2C2C31] rounded-[20px] mt-3.75">
            <h1 className="text-2xl font-russo text-white">Редактирование товара</h1>
            <p className={'text-sm text-white/55'}>Вы можете отредактировать товар или оставить все как есть</p>
            <ProductForm productId={id} initialData={currentProduct} className={'mt-4.75'}/>
        </Container>
    );
}