'use client'

import React from 'react'
import { LeftSide } from '@/components/shared/account/leftSide'
import { useUserStore } from '@/store/user.store'
import { useAuthStore } from '@/store/auth.store'
import { Container } from '@/components/ui/container'
import useIsMobile from '@/hooks/use-is-mobile'
import { cn } from '@/lib/utils'

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useUserStore()
    const { isMobile } = useIsMobile()
    const { logOut, isLoading } = useAuthStore()

    return (
        <Container className={cn(!isMobile ? 'flex gap-3 my-3.75 items-start' : 'my-3.75')}>
            {!isMobile && (
                <LeftSide
                    user={user}
                    isLoading={isLoading}
                    logOut={logOut}
                    className="w-109.25 shrink-0"
                />
            )}
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </Container>
    )
}
