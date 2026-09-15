import {Container} from "@/components/ui/container";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {PromotionForm} from "@/components/shared/admin/promotion/PromotionForm";

export default function Page () {
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <div className={'flex justify-between'}>
                <div>
                    <h2 className={'font-russo text-2xl'}> Создать акцию</h2>
                    <p className={'text-sm text-white/55'}>Здесь вы можете создать акцию</p>
                </div>
                <Link href={'/admin/marketing/discount'}>
                    <Button className={'bg-[#46464E] rounded-[20px] p-5'}><ArrowLeft width={16} height={16}/></Button>
                </Link>
            </div>
            <PromotionForm/>
        </Container>
    )
}