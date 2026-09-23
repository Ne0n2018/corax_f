'use client'

import { RightSide } from "@/components/shared/account/rightSide";
import { useUserStore } from "@/store/user.store";

export default function AccountPage() {
    const { user } = useUserStore()
    return <RightSide user={user} className="w-full" />
}