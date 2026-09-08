import {Container} from "@/components/ui/container";
import {CategoryForm} from "@/components/shared/admin/category/categoryForm";

export default function Page () {
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <h1 className={'text-2xl font-russo'}>Создание категории</h1>
            <p className={'text-sm text-white/55'}>Создание категории и подкатегории</p>
            <CategoryForm className={'mt-3.75'}/>
        </Container>
    )
}