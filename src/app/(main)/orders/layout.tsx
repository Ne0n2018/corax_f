'use client'

import React from 'react'
import {RouteGuard} from '@/components/shared/route-guard'

export default function OrdersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <RouteGuard requireAuth>{children}</RouteGuard>
}
