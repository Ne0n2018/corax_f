import {Container} from "@/components/ui/container";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PromoCatalog} from "@/components/shared/admin/promo/promoCatalog";

export default function Page () {
    return (
       <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75 h-screen">
           <div className={'flex justify-between'}>
                <div>
                    <h2 className={'text-2xl font-russo '}>Промокоды</h2>
                    <p className={'text-sm text-white/55'}>Здесь вы можете управлять промокодами</p>
                </div>
               <Link href={'/admin/marketing/promoCode/create'}>
                   <Button className={'bg-[#46464E] rounded-[13px] py-2.75'}>Создать промокод</Button>
               </Link>
           </div>
           <PromoCatalog/>
       </Container>
    )
}