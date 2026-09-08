'use client'
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {User} from "@/components/shared/header/user.dialog";

export type AccountModal = 'account' | 'notification' |  null

interface AccountModalProps {
    mode: AccountModal;
    onModeChange: (mode: AccountModal) => void;
    onClose: () => void;
}

export function AccountDialog({mode,onModeChange,onClose}: AccountModalProps) {
    const isOpen = mode !== null
    return (
        <Dialog open={isOpen} onOpenChange={(open)=> !open && onClose()}>
            <DialogContent className={'fixed top-4 right-4 left-auto bottom-auto z-50 translate-x-0 translate-y-0 sm:max-w-100 bg-white'}>
                {mode === 'account' && ( <User onSwitchToNotify={()=> onModeChange("notification")} onClose={()=>onModeChange(null)}/>)}
            </DialogContent>
        </Dialog>
    )
}