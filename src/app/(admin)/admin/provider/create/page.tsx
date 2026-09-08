import {Container} from "@/components/ui/container";
import {ProviderForm} from "@/components/shared/admin/provider/providerForm";

export default function Page () {
    return (<Container className={'bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75'}>
        <h2 className={'font-russo text-2xl'}>Создание поставщика</h2>
        <p className={'text-sm text-white/55'}>Заполните все поля и не забудьте сохранить</p>
        <ProviderForm className={'mt-4.75'}/>
    </Container>)
}