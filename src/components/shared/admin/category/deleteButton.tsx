'use client'
import {Button} from "@/components/ui/button";
import {useCategoryStore} from "@/store/category.store";
import {useRouter} from "next/navigation";

interface DeleteButtonProps {
    id: string;
}

export function DeleteButton ({id}: DeleteButtonProps)  {

    const {isLoading, deleteCategory} = useCategoryStore()

    const router = useRouter()

    const onClick = async () => {
        if (await deleteCategory(id)) {
            router.push('/admin/category/')
        }
    }

    return (<Button
        onClick={() => onClick()}
        disabled={isLoading}
        className="bg-[#46464E] rounded-[13px] px-8.75 py-3.25"
    >Удалить</Button>)
}