import {Container} from "@/components/ui/container";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {PromotionCatalog} from "@/components/shared/admin/promotion/PromotionCatalog";

export default function Page () {
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <div className={'flex justify-between'}>
                <div>
                    <h2 className={'font-russo text-2xl'}>Акции</h2>
                    <p className={'text-sm text-white/55'}>Здесь вы можете управлять акциями</p>
                </div>
                <Link href={'/admin/marketing/discount/create'}>
                    <Button className={'bg-[#46464E] rounded-[13px] py-2.75'}>Создать акцию</Button>
                </Link>
            </div>
            <PromotionCatalog className={'mt-3.75'}/>
        </Container>
    )
}