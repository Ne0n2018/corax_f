import {User} from "@/types/user";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {FilePen} from "lucide-react";
import {UserData} from "@/components/shared/account/right-window/userData";

interface CredentialsProps {
    user: User | null;
    className?: string;
    onSwitchToEdit: () => void;
    onSwitchToAddress: () => void;
}

export function Credential({user, className, onSwitchToEdit, onSwitchToAddress}: CredentialsProps) {
    return (
        <div className={cn('',className)}>
            <h2 className={'font-russo font-bold text-2xl'}>Учетные данные</h2>
            <p className={'text-sm text-[#9E9E9E] mb-5'}>Редактируйте данные и держите профиль в актуальном состоянии</p>
            <UserData user={user}/>
            <div className={'mt-5'}>
                <Button className={'text-[#A0A0A2] text-xs bg-[#2C2C31] border border-[#A0A0A2] rounded-[13px] px-4.5 py-3.5'} onClick={()=> onSwitchToEdit()}>
                    <FilePen />
                    Изменить учетные данные
                </Button>
            </div>
            <div className={'p-5 bg-[#2C2C31] border border-solid border-[#50505E] rounded-[20px] w-full mt-5'}>
                <h2 className={'text-sm font-bold mb-5'}>Выберите адрес доставки</h2>
                {user?.address ? (
                    <div className={'flex flex-col gap-3.75'}>
                        <p className={'bg-[#46464E] rounded-[13px] py-3.5 px-5'}>{user.address}</p>
                        <Button className={'w-full text-sm bg-[#46464E] rounded-[13px] py-3.5'} onClick={()=> onSwitchToAddress()}>Изменить адрес</Button>
                    </div>
                ) : (<Button className={'w-full text-sm bg-[#46464E] rounded-[13px] py-3.5'} onClick={()=> onSwitchToAddress()}>Добавить адрес</Button>)}
            </div>

        </div>
    )
}