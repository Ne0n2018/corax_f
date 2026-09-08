'use client'

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {useUserStore} from "@/store/user.store";

export function UserSearch() {
    const { params, setParams, getUsers } = useUserStore();
    const [searchValue, setSearchValue] = useState(params.search || "");

    const handleSearch = () => {
        setParams({ search: searchValue, page: 1 });
        getUsers();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="w-full relative">
            <Input
                type="text"
                placeholder="Поиск по имени, email или роли..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-[#2C2C31] border-[#50505E] text-white placeholder:text-gray-400 rounded-[20px] px-7 py-5 pr-14 focus-visible:ring-1 focus-visible:ring-red-500"
            />
            <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-2"
            >
                <Search className="w-5 h-5" />
            </button>
        </div>
    );
}