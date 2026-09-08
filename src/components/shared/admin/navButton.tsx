'use client'

import {Button} from "@/components/ui/button";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {useProductStore} from "@/store/product.store";

export function NavButton() {
    const pathname = usePathname();
    const {adminDelete: onDelete, currentProduct, isLoading} = useProductStore();
    const router = useRouter();

    const getRouteConfig = () => {
        if (pathname === '/admin/product') {
            return { label: 'Категории', href: '/admin/category', isAction: false };
        }

        if (pathname === '/admin/product/create') {
            return { label: 'Назад', href: '/admin/product', isAction: false };
        }

        if (pathname === '/admin/category') {
            return { label: 'Товары', href: '/admin/product', isAction: false };
        }

        if (pathname.startsWith('/admin/product/') && pathname !== '/admin/product/create') {
            return { label: 'Удалить товар', href: '', isAction: true };
        }

        return { label: 'Назад', href: '/admin/product', isAction: false };
    };

    const config = getRouteConfig();

    // Обработчик удаления с редиректом
    const handleDelete = async () => {
        if (!currentProduct?.id) return;

        // Дополнительно можно добавить подтверждение
        const confirmed = confirm("Вы действительно хотите удалить этот товар?");
        if (!confirmed) return;

        const isSuccess = await onDelete(currentProduct.id);

        if (isSuccess) {
            router.push('/admin/product');
        }
    };

    if (config.isAction) {
        return (
            <Button
                type="button"
                disabled={isLoading}
                onClick={handleDelete}
                className="text-sm bg-[#46464E] hover:bg-[#b83325] text-white px-6.25 py-2.5 rounded-[13px] transition-colors"
            >
                {isLoading ? "Удаление..." : config.label}
            </Button>
        );
    }

    return (
        <Link href={config.href}>
            <Button className="text-sm bg-[#46464E] hover:bg-[#5a5a65] text-white px-12 py-3.25 rounded-[13px] transition-colors">
                {config.label}
            </Button>
        </Link>
    );
}