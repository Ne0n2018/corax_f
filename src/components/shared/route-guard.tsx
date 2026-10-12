'use client'

import React, {useEffect, useRef} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {useUserStore} from '@/store/user.store'
import {Roles} from '@/types/user'

interface RouteGuardProps {
    children: React.ReactNode
    // Требовать авторизацию (по умолчанию — да)
    requireAuth?: boolean
    // Требовать конкретную роль (или одну из списка). Если не задана — роль не проверяется
    role?: Roles | Roles[]
    // Куда перенаправлять при отказе в доступе
    redirectTo?: string
}

export function RouteGuard({
    children,
    requireAuth = true,
    role,
    redirectTo = '/',
}: RouteGuardProps) {
    const user = useUserStore((state) => state.user)
    const isLoading = useUserStore((state) => state.isLoading)
    const getMe = useUserStore((state) => state.getMe)

    const router = useRouter()

    // Профиль мог ещё не запрашиваться (например, при прямом заходе на защищённый URL)
    const requested = useRef(false)
    useEffect(() => {
        if (!requested.current && useUserStore.getState().isLoading) {
            requested.current = true
            getMe()
        }
    }, [getMe])

    const allowedRoles = role ? (Array.isArray(role) ? role : [role]) : null

    const isDeniedAuth = requireAuth && !isLoading && !user
    const isDeniedRole =
        requireAuth &&
        !isLoading &&
        !!user &&
        allowedRoles !== null &&
        !allowedRoles.includes(user.role)

    useEffect(() => {
        if (isDeniedAuth) {
            toast.error('Для доступа к этому разделу необходимо войти в аккаунт')
            router.replace(redirectTo)
        } else if (isDeniedRole) {
            toast.error('Доступ запрещён: раздел доступен только администраторам')
            router.replace(redirectTo)
        }
    }, [isDeniedAuth, isDeniedRole, redirectTo, router])

    // Пока проверяем доступ или уже перенаправляем — показываем заглушку
    if (isLoading || isDeniedAuth || isDeniedRole) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#1E1E24]">
                <span className="text-white text-lg font-russo animate-pulse">Загрузка...</span>
            </div>
        )
    }

    return <>{children}</>
}
