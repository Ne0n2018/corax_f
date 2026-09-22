import React from 'react'
import { Container } from '@/components/ui/container'
import { OrdersManagement } from '@/components/shared/admin/orders/orders-management'

export const metadata = {
    title: 'Управление заказами — Панель администратора',
}

export default function AdminOrderPage() {
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <h1 className="font-russo text-2xl text-white">Управление заказами</h1>
            <OrdersManagement />
        </Container>
    )
}
