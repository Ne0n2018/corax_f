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

export function AuthDialog({ mode, onModeChange, onClose }: AuthModalProps) {
    const isOpen = mode !== null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/*
              p-0 - убираем дефолтные отступы
              flex flex-col - делаем окно колонкой
              overflow-hidden - окно само не скроллится
              gap-0 - убираем отступ между шапкой и формой от shadcn
            */}
            <DialogContent className="sm:max-w-163.5 bg-white p-0 flex flex-col overflow-visible max-h-[60vh] md:max-h-[60vh] gap-0 rounded-3xl">
                {mode === "Login" && (
                    <Login
                        onSwitchToRegister={() => onModeChange('Register')}
                        onSwitchToRecovery={() => onModeChange('password')}
                        isOpen={isOpen}
                        onClose={() => onClose()}
                    />
                )}
                {mode === 'password' && (
                    <RecoveryPasswordDialog onSwitchToLogin={() => onModeChange('Login')} />
                )}
                {mode === 'Register' && (
                    <RegisterDialog
                        onSwitchToLogin={() => onModeChange('Login')}
                        isOpen={isOpen}
                        onClose={() => onClose()}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}