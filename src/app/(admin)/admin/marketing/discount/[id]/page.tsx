'use client'
import {useParams, useRouter} from "next/navigation";
import {Container} from "@/components/ui/container";
import {PromotionForm} from "@/components/shared/admin/promotion/PromotionForm";
import {DeleteButton} from "@/components/shared/admin/promotion/deleteButton";

export default function Page () {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    return (
       <Container className="px-5 py-7.5 bg-[#2C2C31] rounded-[20px] mt-3.75">
           <div className={'flex justify-between'}>
               <div>
                   <h2 className={'text-2xl font-russo'}>Редактирование акции</h2>
                   <p className={'text-sm text-white/55'}>Здесь вы можете отредактировать акцию</p>
               </div>
               <DeleteButton promotionId={id}  callBack={()=>router.push('/admin/marketing/discount')}/>
           </div>
           <PromotionForm promotionId={id}/>
       </Container>
    )
}