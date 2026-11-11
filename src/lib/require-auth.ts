import {toast} from "sonner";
import {useUserStore} from "@/store/user.store";
import {useAuthModalStore} from "@/store/auth-modal.store";
import {isAuthBlockedByCookieConsent, useCookieConsentStore} from "@/store/cookie-consent.store";
import type {AuthModal} from "@/components/shared/header/auth.dialog";

/**
 * Открывает диалог авторизации с учётом согласия на cookie-файлы:
 * при отказе вход заблокирован на уровне API, поэтому показываем
 * объясняющий тост и возвращаем плашку согласия.
 */
export function openAuthDialog(mode: AuthModal): void {
    if (isAuthBlockedByCookieConsent()) {
        toast.error("Чтобы войти в аккаунт, примите использование cookie-файлов");
        useCookieConsentStore.getState().resetConsent();
        return;
    }
    useAuthModalStore.getState().openAuth(mode);
}

/**
 * Проверяет авторизацию. Если пользователь не залогинен — показывает
 * тост с кнопкой «Войти», которая открывает диалог авторизации.
 *
 * @returns true если авторизован, false — иначе
 */
export function requireAuth(message: string): boolean {
    const user = useUserStore.getState().user;
    if (user) return true;

    toast.error(message, {
        description: "Войдите или зарегистрируйтесь, чтобы продолжить",
        action: {
            label: "Войти",
            onClick: () => openAuthDialog("Login"),
        },
        duration: 8000,
    });
    return false;
}
