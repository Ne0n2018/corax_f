import {Container} from "@/components/ui/container";
import {CategoryForm} from "@/components/shared/admin/category/categoryForm";
import {DeleteButton} from "@/components/shared/admin/category/deleteButton";

interface PageProps {
    params: Promise<{id: string}>
}

export default async function Page ({params}: PageProps) {
    const {id} = await params;
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <div className={'flex flex-row justify-between'}>
                <div>
                    <h1 className={'font-russo text-2xl'}>Редактирование</h1>
                    <p className={'text-sm text-white/55'}>Добавляйте и редактируйте категории</p>
                </div>
                <div>
                    <DeleteButton id={id}/>
                </div>
            </div>
            <CategoryForm id={id} className={'mt-3.75'}/>
        </Container>
    )
}