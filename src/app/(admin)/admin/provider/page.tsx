import {Container} from "@/components/ui/container";
import {ProviderCatalog} from "@/components/shared/admin/provider/providerCatalog";
import Link from "next/link";
import {Button} from "@/components/ui/button";


export default function Page() {
    return (<Container className={'bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75'}>
        <div className={'flex flex-row justify-between'}>
            <div>
                <h2 className={'font-russo text-2xl'}>Список поставщиков</h2>
                <p className={'text-sm text-white/55'}>Здесь расположен весь список поставщиков</p>
            </div>
            <Link href={'/admin/provider/create'}>
                <Button className={'rounded-[13px] bg-[#46464E] px-12.5 py-3.25'}> Создать поставщика</Button>
            </Link>
        </div>
        <ProviderCatalog/>
    </Container>)
}