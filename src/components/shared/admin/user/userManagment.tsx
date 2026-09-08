'use client'

import {useEffect} from "react";
import {useUserStore} from "@/store/user.store";

import {Button} from "@/components/ui/button";
import {UserSearch} from "@/components/shared/admin/user/userSearch";
import {UserItem} from "@/components/shared/admin/user/useritem";

export function UserManagement() {
    const { users, meta, isLoading, getUsers, params, setParams } = useUserStore();

    useEffect(() => {
        getUsers();
    }, [params.page]);

    return (
        <div className="flex flex-col gap-6 p-4 ">


            {/* Поиск */}
            <UserSearch />

            {/* Список */}
            {isLoading ? (
                <p className="text-white text-sm">Загрузка пользователей...</p>
            ) : users.length === 0 ? (
                <p className="text-white text-sm">Пользователи не найдены</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {users.map((user) => (
                        <UserItem key={user.id} user={user} />
                    ))}
                </div>
            )}

            {/* Пагинация */}
            {meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4 text-white">
                    <Button
                        disabled={meta.page <= 1}
                        onClick={() => setParams({ page: meta.page - 1 })}
                        className="bg-[#2C2C31] hover:bg-[#3A3A40] text-white rounded-[12px] px-4 py-2 disabled:opacity-40 cursor-pointer"
                    >
                        Назад
                    </Button>
                    <span className="text-sm">
                        {meta.page} из {meta.totalPages}
                    </span>
                    <Button
                        disabled={meta.page >= meta.totalPages}
                        onClick={() => setParams({ page: meta.page + 1 })}
                        className="bg-[#2C2C31] hover:bg-[#3A3A40] text-white rounded-[12px] px-4 py-2 disabled:opacity-40 cursor-pointer"
                    >
                        Вперед
                    </Button>
                </div>
            )}
        </div>
    );
}