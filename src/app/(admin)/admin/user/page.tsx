import {Container} from "@/components/ui/container";
import {UserManagement} from "@/components/shared/admin/user/userManagment";

export default function Page () {
    return (<Container className={'bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75'}>
        <h1 className="font-russo text-2xl">Управление пользователями</h1>
        <UserManagement/>
    </Container>)
}