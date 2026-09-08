'use client'
import {LeftSide} from "@/components/shared/account/leftSide";
import {useUserStore} from "@/store/user.store";
import {useAuthStore} from "@/store/auth.store";
import {Container} from "@/components/ui/container";
import useIsMobile from "@/hooks/use-is-mobile";
import {RightSide} from "@/components/shared/account/rightSide";
import {cn} from "@/lib/utils";

export default function Account () {
    const {user} = useUserStore()
    const {isMobile} = useIsMobile()
    const {logOut, isLoading} = useAuthStore()
    return (
        <Container className={cn(!isMobile ? 'flex gap-3 my-3.75' : 'my-3.75')}>
            {!isMobile && (<LeftSide user={user} isLoading={isLoading} logOut={logOut} className={'w-109.25'}/>)}
            <RightSide user={user} className={'flex-1'}/>
        </Container>
    )
}