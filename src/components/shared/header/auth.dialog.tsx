'use client'
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {RegisterDialog} from "@/components/shared/header/register.dialog";
import {RecoveryPasswordDialog} from "@/components/shared/header/recovery-password.dialog";
import {Login} from "@/components/shared/header/login.dialog";

export type AuthModal = 'Register' | 'Login' | 'password' | null

interface AuthModalProps {
    mode: AuthModal;
    onModeChange: (mode: AuthModal) => void;
    onClose: () => void;
}

export function AuthDialog({mode,onModeChange,onClose}: AuthModalProps) {
    const isOpen = mode !== null
    return (
        <Dialog open={isOpen} onOpenChange={(open)=> !open && onClose()}>
            <DialogContent className={'sm:max-w-163.5 bg-white max-h-[60vh]'}>
                    {mode === "Login" && (
                        <Login
                            onSwitchToRegister={() => onModeChange('Register')}
                            onSwitchToRecovery={() => onModeChange('password')}
                            isOpen={isOpen}
                            onClose={() => onModeChange(null)}
                        />
                    )}
                    {mode === 'password' && (
                        <RecoveryPasswordDialog onSwitchToLogin={() => onModeChange('Login')}/>
                    )}
                    {mode === 'Register' && (
                        <RegisterDialog
                            onSwitchToLogin={() => onModeChange('Login')}
                            isOpen={isOpen}
                            onClose={() => onModeChange(null)}
                        />
                    )}
            </DialogContent>
        </Dialog>
    )
}