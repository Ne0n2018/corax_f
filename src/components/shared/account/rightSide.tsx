'use client'

import {User} from "@/types/user";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {Credential} from "@/components/shared/account/right-window/credential";
import {Edit} from "@/components/shared/account/right-window/edit";
import {AddressAutocomplete} from "@/components/shared/account/right-window/addressAutoComplite";

interface CredentialsProps {
    user: User ;
    className?: string;
}

export type WindowType = 'Credential' | 'Edit' | 'Address' | null

export function RightSide({user, className}: CredentialsProps) {

    const [onMode, onModeChange] = useState<WindowType>('Credential')

    return (
        <div className={cn('p-7.5 bg-[#2C2C31] rounded-[20px]', className)}>
            {onMode === 'Credential' && (<Credential user={user} onSwitchToEdit={()=>onModeChange('Edit')} onSwitchToAddress={()=>onModeChange('Address')} />)}
            {onMode === 'Edit' && (<Edit user={user} onClose={()=>onModeChange('Credential')}/>)}
            {onMode === 'Address' && (<AddressAutocomplete onBack={()=> onModeChange('Credential')}/>)}
        </div>
    )
}