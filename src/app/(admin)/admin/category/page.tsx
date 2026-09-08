import {Container} from "@/components/ui/container";
import {CategoryCatalog} from "@/components/shared/admin/category/catagoryCatalog";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Page () {
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <div className={'flex justify-between'}>
                <div>
                    <h1 className={'font-russo text-2xl '}>Список категорий</h1>
                    <p className={'text-sm text-white/55'}>Здесь расположен весь список категорий товаров</p>
                </div>
                <Link href={'/admin/category/create'}>
                    <Button className={'bg-[#46464E] px-3.75 py-3.25 rounded-[13px]'}>Добавить категорию</Button>
                </Link>
            </div>
            <CategoryCatalog className={'mt-5'}/>
        </Container>
    )
}