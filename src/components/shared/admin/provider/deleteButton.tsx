'use client'
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useProviderStore} from "@/store/provider.store";

interface DeleteButtonProps {
    id: string;
}

export function DeleteButton ({id}: DeleteButtonProps)  {

    const {isLoading, adminDelete} = useProviderStore()

    const router = useRouter()

    const onClick = async () => {
        if (await adminDelete(id)) {
            router.push('/admin/provider/')
        }
    }

    return (<Button
        onClick={() => onClick()}
        disabled={isLoading}
        className="bg-[#46464E] rounded-[13px] px-8.75 py-3.25"
    >Удалить</Button>)
}