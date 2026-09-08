'use client'

import {useParams} from "next/navigation";
import {Container} from "@/components/ui/container";
import {ProviderForm} from "@/components/shared/admin/provider/providerForm";
import {DeleteButton} from "@/components/shared/admin/provider/deleteButton";

export default function EditProviderPage() {
    const params = useParams();
    const id = params.id as string;


    return (
        <Container className="px-5 py-7.5 bg-[#2C2C31] rounded-[20px] mt-3.75">
            <div className={'flex flex-row justify-between'}>
                <div>
                    <h1 className="text-2xl font-russo text-white">Редактирование поставщика</h1>
                    <p className={'text-sm text-white/55'}>Вы можете отредактировать поставщика или оставить все как есть</p>
                </div>
                <DeleteButton id={id}/>
            </div>
            <ProviderForm id={id} className={'mt-4.75'}/>
        </Container>
    );
}