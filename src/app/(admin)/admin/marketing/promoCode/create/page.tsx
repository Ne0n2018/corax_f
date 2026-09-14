import {Container} from "@/components/ui/container";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {MoveLeft} from "lucide-react";
import {PromoForm} from "@/components/shared/admin/promo/promoForm";


export default function Page () {
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <div className={'flex justify-between'}>
                <div>
                    <h2 className={'font-russo text-2xl'}>Промокоды</h2>
                    <p className={'text-sm text-white/55'}>Создайте новый промокод</p>
                </div>
                <Link href={'/admin/marketing/promoCode'}>
                    <Button className={'bg-[#46464E] rounded-[20px] p-5'}>
                        <MoveLeft className={'w-4 h-4'}/>
                    </Button>
                </Link>
            </div>
            <PromoForm className={'mt-5'}/>
        </Container>
    )
}