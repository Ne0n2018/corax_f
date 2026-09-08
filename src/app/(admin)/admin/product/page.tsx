import {Container} from "@/components/ui/container";
import {Button} from "@/components/ui/button";
import {ProductCatalog} from "@/components/shared/admin/product/productCatalog";
import Link from "next/link";

export default function Page() {
    return (<Container className="bg-[#2C2C31] rounded-[20px] mt-3.75 px-5 py-7.5">
        <div className={'flex justify-between'}>
            <div>
                <h2 className={'font-russo text-2xl'}>Список товаров</h2>
                <p className={'text-sm text-[#737373]'}>Здесь расположен весь список товаров из каталога</p>
            </div>
            <div>
                <Button className={'bg-[#46464E] rounded-[13px] px-3.75 py-3.25'}><Link href={'/admin/product/create'}>Создать товар</Link></Button>
            </div>
        </div>
        <ProductCatalog/>
    </Container>)
}