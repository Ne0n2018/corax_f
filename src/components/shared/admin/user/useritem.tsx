'use client'

import {useState} from "react";
import {Roles, User} from "@/types/user";
import {Button} from "@/components/ui/button";

import {useUserStore} from "@/store/user.store";
import {cn} from "@/lib/utils";
import {UserRoleSelect} from "@/components/shared/admin/user/userRoleSelect";
import {BlockUserModal} from "@/components/shared/admin/user/blockUserModal";

interface Props {
    user: User;
}

export function UserItem({ user }: Props) {
    const { updateRole, blockUser,  } = useUserStore();
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

    const handleRoleChange = (newRole: Roles) => {
        if (newRole !== user.role) {
            updateRole(user.id, newRole);
        }
    };

    const handleToggleStatus = () => {
        if (user.isActive) {
            setIsBlockModalOpen(true);
        } else {
            blockUser(user.id);
        }
    };

    return (
        <>
            <div className="bg-[#2C2C31] border border-[#50505E] rounded-[20px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Информация */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-base">{user.displayName || "Без имени"}</span>
                        <span className={cn("w-2 h-2 rounded-full", user.isActive ? "bg-green-500" : "bg-red-500")} />
                    </div>
                    <span className="text-gray-400 text-sm">{user.email}</span>
                    <span className="text-gray-500 text-xs">{user.number}</span>
                </div>

                {/* Управление */}
                <div className="flex items-center gap-3">
                    {/* Выбор роли */}
                    <UserRoleSelect currentRole={user.role} onChange={handleRoleChange} />

                    {/* Кнопка Статуса */}
                    <Button
                        onClick={handleToggleStatus}
                        className={cn(
                            "rounded-[12px] px-4 py-2 text-xs font-medium cursor-pointer transition-colors",
                            user.isActive
                                ? "bg-[#D83C2D] hover:bg-[#b83325] text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                        )}
                    >
                        {user.isActive ? "Заблокировать" : "Разблокировать"}
                    </Button>
                </div>
            </div>

            {/* Модалка для вывода причины блокировки */}
            <BlockUserModal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                onConfirm={(reason) => blockUser(user.id, reason)}
                userName={user.displayName || user.email}
            />
        </>
    );
}

