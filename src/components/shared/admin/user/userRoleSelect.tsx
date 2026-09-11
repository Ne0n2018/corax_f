'use client'

import {Roles} from "@/types/user";
import {Shield} from "lucide-react";

interface Props {
    currentRole: Roles;
    onChange: (newRole: Roles) => void;
    isLoading: boolean;
}

const ROLES: { value: Roles; label: string }[] = [
    { value: "REGULAR", label: "Пользователь" },
    { value: "GYM", label: "Спортивный зал" },
    { value: "ADMIN", label: "Администратор" },
];

export function UserRoleSelect({ currentRole, onChange, isLoading }: Props) {
    return (
        <div className="relative inline-block">
            <select
                value={currentRole}
                onChange={(e) => onChange(e.target.value as Roles)}
                disabled={isLoading}
                className="bg-[#3A3A40] hover:bg-[#46464E] border border-[#50505E] text-white text-xs font-semibold rounded-[12px] px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none pr-8 transition-colors"
            >
                {ROLES.map((r) => (
                    <option key={r.value} value={r.value} className="bg-[#2C2C31] text-white">
                        {r.label}
                    </option>
                ))}
            </select>
            <Shield className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    );
}