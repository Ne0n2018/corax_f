import React from 'react'
import { Container } from '@/components/ui/container'

export default function NewPasswordPage() {
    return (
        <Container className="py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                    Восстановление пароля
                </h1>
                <p className="text-sm text-gray-500">
                    Пожалуйста, введите новый пароль в открывшемся окне.
                </p>
            </div>
        </Container>
    )
}
