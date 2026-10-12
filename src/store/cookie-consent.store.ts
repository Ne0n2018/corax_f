import {create} from "zustand";
import {persist} from "zustand/middleware";

// Решение пользователя по использованию cookie-файлов
// null — решение ещё не принято (плашка не показана/не закрыта)
export type CookieConsent = "accepted" | "rejected" | null;

interface CookieConsentStore {
    consent: CookieConsent;
    acceptCookies: () => void;
    rejectCookies: () => void;
    // Сбросить решение — снова показать плашку (например, чтобы изменить выбор)
    resetConsent: () => void;
}

export const useCookieConsentStore = create<CookieConsentStore>()(
    persist(
        (set) => ({
            consent: null,
            acceptCookies: () => set({consent: "accepted"}),
            rejectCookies: () => set({consent: "rejected"}),
            resetConsent: () => set({consent: null}),
        }),
        {
            name: "cookie-consent-storage",
            version: 1,
        },
    ),
);

// Пользователь отказался от cookie — авторизация на сайте запрещена
export const isAuthBlockedByCookieConsent = () =>
    useCookieConsentStore.getState().consent === "rejected";
