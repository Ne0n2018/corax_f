'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LeftSide } from '@/components/shared/account/leftSide'
import { NotificationsWindow } from '@/components/shared/account/notificationsWindow'
import { useUserStore } from '@/store/user.store'
import { useAuthStore } from '@/store/auth.store'
import { Container } from '@/components/ui/container'
import useIsMobile from '@/hooks/use-is-mobile'
import { RouteGuard } from '@/components/shared/route-guard'

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useUserStore()
    const { isMobile } = useIsMobile()
    const { logOut, isLoading } = useAuthStore()
    const pathname = usePathname()

    // В правой колонке показываем либо раздел аккаунта, либо уведомления.
    // Запоминаем путь, на котором открыты уведомления: при переходе в другой
    // раздел они автоматически закрываются без синхронного setState в эффекте.
    const [notificationsPath, setNotificationsPath] = useState<string | null>(null)
    const isNotificationsOpen = notificationsPath === pathname

    const toggleNotifications = () =>
        setNotificationsPath((prev) => (prev === pathname ? null : pathname))

    return (
        <RouteGuard requireAuth>
            {isMobile ? (
                <Container className="my-3.75">{children}</Container>
            ) : (
                <Container className="flex gap-3 my-3.75 items-stretch">
                    <LeftSide
                        user={user}
                        isLoading={isLoading}
                        logOut={logOut}
                        className="w-109.25 shrink-0"
                        onNotificationsClick={toggleNotifications}
                        isNotificationsOpen={isNotificationsOpen}
                    />
                    {/* Высота правого блока всегда равна левому, содержимое скроллится */}
                    <div className="relative flex-1 min-w-0">
                        <div className="absolute inset-0 overflow-y-auto pretty-scrollbar pr-1">
                            {isNotificationsOpen ? (
                                <NotificationsWindow onClose={() => setNotificationsPath(null)} />
                            ) : (
                                <div className="min-h-full flex flex-col [&>*]:flex-1">{children}</div>
                            )}
                        </div>
                    </div>
                </Container>
            )}
        </RouteGuard>
    )
}
